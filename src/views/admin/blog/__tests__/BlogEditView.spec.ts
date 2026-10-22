import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import { createI18n } from "vue-i18n";
import { ptBR } from "@/i18n/locales/pt-BR";
import { ApiError } from "@/composables/api/useApi";
import BlogEditView from "../BlogEditView.vue";

const repo = vi.hoisted(() => ({ getAdminPost: vi.fn(), update: vi.fn(), create: vi.fn() }));
vi.mock("@/composables/posts/usePostRepository", () => ({ usePostsRepository: () => repo }));
const editor = defineComponent({ props: ["modelValue", "disabled"], emits: ["update:modelValue", "uploading"],
  template: '<textarea data-editor :value="modelValue" :disabled="disabled" @input="$emit(\'update:modelValue\', $event.target.value)" />' });
const original = { id: "post-1", user_id: 1, title: "Arte", slug: "arte", excerpt: "Resumo",
  content: "<p>Original</p>", thumbnail: "https://cdn.example.test/old.png", tags: ["art"],
  status: "draft", published_at: null, lang: "pt", views_count: 2, likes_count: 1 };
const wrappers: ReturnType<typeof mount>[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:preview") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  repo.getAdminPost.mockResolvedValue({ data: original });
  repo.update.mockResolvedValue({ data: { ...original, slug: "arte-2", content: "<p>Sanitizado</p>", thumbnail: "https://cdn.example.test/new.png" } });
});
afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0; vi.restoreAllMocks(); });

async function open() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: "/admin/blog/editor/:id?", component: BlogEditView }] });
  await router.push("/admin/blog/editor/post-1");
  const wrapper = mount(defineComponent({ template: "<RouterView />" }), { global: {
    plugins: [router, createI18n({ legacy: false, locale: "pt-BR", messages: { "pt-BR": ptBR } })],
    stubs: { TiptapEditor: editor },
  } });
  wrappers.push(wrapper);
  await flushPromises();
  return wrapper;
}

describe("post editor persistence", () => {
  it("saves a thumbnail once, applies canonical fields and releases the preview", async () => {
    const wrapper = await open();
    const input = wrapper.find('input[type="file"]');
    const file = new File(["PNG"], "art.png", { type: "image/png" });
    Object.defineProperty(input.element, "files", { configurable: true, value: [file] });
    await input.trigger("change");
    const save = () => wrapper.findAll("button").find(b => b.text() === "Atualizar")!;
    await save().trigger("click"); await flushPromises();
    expect(repo.update.mock.calls[0]?.[1].thumbnail).toBe(file);
    expect((wrapper.find("#post-slug").element as HTMLInputElement).value).toBe("arte-2");
    expect((wrapper.find("[data-editor]").element as HTMLTextAreaElement).value).toBe("<p>Sanitizado</p>");
    expect(wrapper.find('img[alt="Prévia da thumbnail"]').attributes("src")).toBe("https://cdn.example.test/new.png");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
    await save().trigger("click"); await flushPromises();
    expect(repo.update.mock.calls[1]?.[1].thumbnail).toBeNull();
  });

  it("does not save while an editorial upload is pending or a save is already running", async () => {
    const wrapper = await open();
    wrapper.findComponent(editor).vm.$emit("uploading", true);
    await flushPromises();
    let save = wrapper.findAll("button").find(b => b.text() === "Atualizar")!;
    expect(save.attributes("disabled")).toBeDefined();
    await save.trigger("click");
    expect(repo.update).not.toHaveBeenCalled();
    wrapper.findComponent(editor).vm.$emit("uploading", false);
    let finish!: (value: unknown) => void;
    repo.update.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    await flushPromises();
    save = wrapper.findAll("button").find(b => b.text() === "Atualizar")!;
    await save.trigger("click");
    await wrapper.findAll("button").find(b => b.text() === "Atualizando...")!.trigger("click");
    expect(repo.update).toHaveBeenCalledTimes(1);
    finish({ data: original }); await flushPromises();
  });

  it("shows thumbnail validation errors and does not replace a valid selection with an invalid file", async () => {
    const wrapper = await open();
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", { configurable: true, value: [new File(["svg"], "bad.svg", { type: "image/svg+xml" })] });
    await input.trigger("change");
    expect(wrapper.find('[role="alert"]').text()).toContain("Use JPG");
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    repo.update.mockRejectedValue(new ApiError("Validation", 422, { errors: { thumbnail: ["Imagem inválida no servidor"] } }));
    await wrapper.findAll("button").find(b => b.text() === "Atualizar")!.trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("Imagem inválida no servidor");
    expect(wrapper.find("#post-title").attributes("disabled")).toBeUndefined();
  });

  it("does not expose a blank writable form after a loading failure", async () => {
    repo.getAdminPost.mockRejectedValue(new ApiError("Forbidden", 403, {}));
    const wrapper = await open();
    expect(wrapper.text()).toContain("Acesso negado");
    expect(wrapper.find("#post-title").exists()).toBe(false);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("confirms unsaved changes when navigating between IDs of the same editor route", async () => {
    const wrapper = await open();
    await wrapper.find("#post-title").setValue("Unsaved art");
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    await wrapper.vm.$router.push("/admin/blog/editor/another-post");
    expect(confirm).toHaveBeenCalledOnce();
    expect(wrapper.vm.$route.params.id).toBe("post-1");
    expect(repo.getAdminPost).toHaveBeenCalledTimes(1);
  });
});

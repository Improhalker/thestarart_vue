import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import type { Editor } from "@tiptap/vue-3";
import { ptBR } from "@/i18n/locales/pt-BR";
import TiptapToolbar from "../TiptapToolbar.vue";
import TiptapEditor from "../TiptapEditor.vue";

const uploadImage = vi.hoisted(() => vi.fn());
vi.mock("@/composables/posts/usePostRepository", () => ({ usePostsRepository: () => ({ uploadImage }) }));
const i18n = () => createI18n({ legacy: false, locale: "pt-BR", messages: { "pt-BR": ptBR } });
const wrappers: ReturnType<typeof mount>[] = [];
beforeEach(() => { uploadImage.mockReset(); vi.spyOn(window, "prompt").mockReturnValueOnce("Art").mockReturnValueOnce(""); });
afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0; vi.restoreAllMocks(); });

describe("Tiptap image upload lifecycle", () => {
  it("allows one upload at a time and ignores completion after unmount", async () => {
    let finish!: (value: { url: string }) => void;
    uploadImage.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const insert = vi.fn();
    const chain = { focus: () => chain, setImage: insert.mockImplementation(() => chain), run: () => true };
    const editor = { isActive: () => false, can: () => ({ undo: () => false, redo: () => false }), chain: () => chain, isDestroyed: false } as unknown as Editor;
    const wrapper = mount(TiptapToolbar, { props: { editor }, global: { plugins: [i18n()] } });
    wrappers.push(wrapper);
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", { value: [new File(["PNG"], "art.png", { type: "image/png" })] });
    await input.trigger("change");
    await input.trigger("change");
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(wrapper.find('[role="status"]').text()).toContain("Enviando");
    const signal = uploadImage.mock.calls[0]?.[1].signal as AbortSignal;
    wrapper.unmount(); wrappers.pop();
    expect(signal.aborted).toBe(true);
    finish({ url: "https://cdn.test/art.png" }); await flushPromises();
    expect(insert).not.toHaveBeenCalled();
  });

  it("synchronizes canonical server HTML and disables editing during save", async () => {
    const wrapper = mount(TiptapEditor, { props: { modelValue: "<p>Before</p>" }, global: { plugins: [i18n()] } });
    wrappers.push(wrapper);
    await flushPromises();
    expect(wrapper.find(".ProseMirror").text()).toBe("Before");
    await wrapper.setProps({ modelValue: "<h2>Server</h2>", disabled: true });
    expect(wrapper.find(".ProseMirror h2").text()).toBe("Server");
    expect(wrapper.find(".ProseMirror").attributes("contenteditable")).toBe("false");
  });
});

import { Plugin, MarkdownRenderChild, MarkdownRenderer } from 'obsidian';

const COLUMNNAME = "col"
const COLUMNMD = COLUMNNAME + "-md"
const TOKEN = "!!!"

export default class ObsidianColumns extends Plugin {

	async onload() {

		this.registerMarkdownCodeBlockProcessor(COLUMNMD, (source, el, ctx) => {
			const sourcePath = ctx.sourcePath;
			let child = el.createDiv();
			MarkdownRenderer.renderMarkdown(
				source,
				child,
				sourcePath,
				null
			);
		});

		this.registerMarkdownCodeBlockProcessor(COLUMNNAME, (source, el, ctx) => {
			const sourcePath = ctx.sourcePath;
			let rows = source.split("\n");
			let child = createDiv();
			MarkdownRenderer.renderMarkdown(
				source,
				child,
				sourcePath,
				null
			);
			let parent = el.createEl("div", { cls: "columnParent" });
			Array.from(child.children).forEach((c) => {
				let cc = parent.createEl("div", { cls: "columnChild" })
				cc.appendChild(c)
			})
		});

		this.registerMarkdownPostProcessor((element, context) => {
			for (let child of Array.from(element.children)) {
				if (child.nodeName != "UL" && child.nodeName != "OL") {
					continue
				}
				for (let listItem of Array.from(child.children)) {
					if (!listItem.textContent.startsWith(TOKEN + COLUMNNAME)) {
						continue
					}
					child.removeChild(listItem)
					let colParent = element.createEl("div", { cls: "columnParent" })
					let itemList = listItem.querySelector("ul, ol")
					for (let itemListItem of Array.from(itemList.children)) {
						let childDiv = colParent.createEl("div", { cls: "columnChild" })
						let span = parseFloat(itemListItem.textContent.split("\n")[0].split(" ")[0])
						if (!isNaN(span)) {
							childDiv.setAttribute("style", "flex-grow:" + span.toString())
						}
						console.log(span)
						console.log([itemListItem.textContent])
						let afterText = false
						for (let itemListItemChild of Array.from(itemListItem.childNodes)) {
							if (afterText) {
								childDiv.appendChild(itemListItemChild)
							}
							if (itemListItemChild.nodeName == "#text") {
								afterText = true
							}
						}
					}
				}
			}
		});
	}

	onunload() {

	}
}
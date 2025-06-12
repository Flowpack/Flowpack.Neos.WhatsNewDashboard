document.addEventListener('DOMContentLoaded', () => {
    const whatsNewIFrame: HTMLIFrameElement | null = document.querySelector('#whatsNewIFrame')

    if (!whatsNewIFrame) return

    const setIFrameHeight = (iFrame: HTMLIFrameElement) => {
        if (iFrame.contentWindow && iFrame.contentWindow.document) {
            iFrame.style.height = iFrame.contentWindow.document.body.scrollHeight + 38 + "px";
        }
    }

    whatsNewIFrame.addEventListener('load', () => setIFrameHeight(whatsNewIFrame))

    window.addEventListener('resize', () => setIFrameHeight(whatsNewIFrame))
})

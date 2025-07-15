from playwright.sync_api import sync_playwright
from langchain_core.documents import Document


def load_page_playwright(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            response = page.goto(url, timeout=60000)
            # page.wait_for_selector("#root", timeout=100000)
        except Exception as e:
            print(f"Navigation threw an exception: {e}")
            browser.close()
            return ""

        if not response or not response.ok:
            print("Navigation failed:", response.status if response else "No response")
            browser.close()
            return ""

        html = page.content()

        # Check if HTML looks suspiciously small
        if len(html.strip()) < 100:
            print("Warning: Page content very small. Might be an error page.")

        # Optional: search for keywords indicating an error
        if any(word in html.lower() for word in ["not found", "error", "access denied", "forbidden"]):
            print("Potential error page detected.")
        browser.close()
        return html

def load_and_split_text(urls, chunk_size=200, chunk_overlap=0):
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from unstructured.partition.html import partition_html

    docs = []
    for url in urls:
        raw_text = ""
        html = load_page_playwright(url)
        elements = partition_html(text=html)
        for element in elements:
            if element.text.strip():
                raw_text += element.text
        docs.append(raw_text)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " "],
    )
    # print("len(docs): ", len(docs))
    all_chunks = []
    for doc in docs:
        chunks = splitter.split_text(doc)
        # print("CHUNKS", chunks)
        all_chunks.append(chunks)
        
    # print("len(chunks):", len(all_chunks))

    return all_chunks
from langchain_community.document_loaders import UnstructuredURLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer, AutoModel


loader = UnstructuredURLLoader(urls=[
    # "https://www.cnbc.com/2025/05/07/crowdstrike-announces-5percent-job-cuts-says-ai-reshaping-every-industry.html",
    # "https://www.cnbc.com/2025/05/07/alphabet-shares-sink-on-report-apple-may-add-ai-search-to-its-browser.html"
    # "https://finance.yahoo.com/news/ametek-acquire-faro-technologies-deal-124613214.html"
    "https://www.npr.org/2025/05/07/nx-s1-5389661/pope-conclave-black-smoke"
])

data = loader.load()
text = data[0].page_content

splitter = RecursiveCharacterTextSplitter(
    separators = ['\n\n', '\n', ' '],
    chunk_size = 200,
    chunk_overlap = 0
)

chunks = splitter.split_text(text)
for chunk in chunks:
    print(len(chunk))
    
    
# df.text from CSV

# encoder = SentenceTransformer('all-MiniLM-L6-v2')
# vectors = encoder.encode(df.text)


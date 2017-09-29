from utilities import read_credentials, scrape_data, write_file
from extractors import test_extractor


FILE_NAME = 'credentials.txt'
OUTPUT = 'output.txt'
EXTRACTOR = test_extractor

credentials = read_credentials(FILE_NAME)
result = scrape_data(*credentials, EXTRACTOR)
write_file(result, OUTPUT)
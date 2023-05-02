from mastodon import Mastodon
import passwords, datetime
from bs4 import BeautifulSoup

Mastodon.create_app(
    'latti_test_app',
    api_base_url= 'Mastodon.social',
    to_file='test_mastodon_save'
)

mastodon = Mastodon(client_id='test_mastodon_save')
mastodon.log_in(
    passwords.username,
    passwords.password,
    to_file='test_mastodon_save'
)

searched = mastodon.search(q='*', min_id=1)

accounts = searched['accounts']
statuses = searched['statuses']
hashtags = searched['hashtags']

# print(statuses)
# print(len(accounts))

posts = mastodon.timeline_local(limit=100)
# posts = mastodon.timeline(limit=100)
post = posts[0]
post_content = post['content']
# print("\nNumber of Posts:", len(posts), "\nContent:\n", post_content, "\n")

soup = BeautifulSoup(post_content, 'html.parser')

# extract text from HTML content
post_text = soup.get_text()
print("\n", post_text, "\n")
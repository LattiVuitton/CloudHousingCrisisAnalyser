from mastodon import Mastodon
import passwords, datetime
import html_text

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

searched = mastodon.search(q='*')

accounts = searched['accounts']
statuses = searched['statuses']
hashtags = searched['hashtags']

print(statuses)
print(len(accounts))
print(len(statuses))
print(len(hashtags))

posts = mastodon.timeline_public(limit=100)
# posts = mastodon.timeline(limit=100)

for post in posts:
    # post = posts[0]
    post_content = post['content']
    # print("\nNumber of Posts:", len(posts), "\nContent:\n", post_content, "\n")

    # soup = BeautifulSoup(post_content, 'html.parser')

    # # extract text from HTML content
    # post_text = soup.get_text()
    
    post_text = html_text.extract_text(post_content)
    # print("---------------------------\n", post_text, "\n")

from mastodon import Mastodon
import passwords

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

searched = mastodon.search("dogs")

accounts = searched['accounts']
statuses = searched['statuses']
hashtags = searched['hashtags']
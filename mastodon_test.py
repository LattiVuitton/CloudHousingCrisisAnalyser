from mastodon import Mastodon

Mastodon.create_app(
    'latti_test_app',
    api_base_url= 'Mastodon.social',
    to_file='test_mastodon_save'
)

mastodon = Mastodon(client_id='test_mastodon_save')

print(mastodon)
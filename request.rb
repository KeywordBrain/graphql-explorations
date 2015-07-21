require 'unirest'
require 'awesome_print'

query = <<-Q
  {
    article(id: 3) {
      id,
      title,
      body
    },
    feed {
      title,
      body,
      author {
        name
      }
    }
  }
Q

res =  Unirest.post(
  'http://localhost:3000/graphql',
  headers: { 'Content-Type' => 'application/graphql' },
  parameters: query,
)

ap res.body

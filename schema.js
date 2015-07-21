import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID
} from 'graphql/lib/type';
 
// taken from
// https://github.com/graphql/graphql-js/blob/master/src/executor/__tests__/executor_schema.js

let BlogImage = new GraphQLObjectType({
  name: 'Image',
  fields: {
    url: { type: GraphQLString },
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
  }
});

let BlogAuthor = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    pic: {
      args: { width: { type: GraphQLInt }, height: { type: GraphQLInt } },
      type: BlogImage,
      resolve: (obj, { width, height }) => obj.pic(width, height)
    },
    recentArticle: { type: BlogArticle }
  })
});

let BlogArticle = new GraphQLObjectType({
  name: 'Article',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    isPublished: { type: GraphQLBoolean },
    author: { type: BlogAuthor },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    keywords: { type: new GraphQLList(GraphQLString) }
  }
});

let BlogQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    article: {
      type: BlogArticle,
      args: { id: { type: GraphQLID } },
      resolve: (_, {id}) => article(id)
    },
    feed: {
      type: new GraphQLList(BlogArticle),
      resolve: () => [
        article(1),
        article(2),
        article(3),
        article(4),
        article(5)
      ]
    }
  }
});

let schema = new GraphQLSchema({
  query: BlogQuery
});

function article(id) {
  return {
    id,
    isPublished: 'true',
    author: johnSmith,
    title: 'My Article ' + id,
    body: 'This is a post',
    hidden: 'This data is not exposed in the schema',
    keywords: ['foo', 'bar', 1, true, null]
  };
}

let johnSmith = {
  id: 123,
  name: 'John Smith',
  pic: (width, height) => getPic(123, width, height),
  recentArticle: article(1)
};

function getPic(uid, width, height) {
  return {
    url: `cdn://${uid}`,
    width: `${width}`,
    height: `${height}`
  };
}
 
export default schema;

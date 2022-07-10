const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql')
const app = express()
const data = require('./data')
// JSON data 만드는 형식 참조 (https://www.youtube.com/watch?v=iiADhChRriM) Web Dev Simplified
console.log(data)

const {answers, categorys, questions} = data


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: CategoryType,
      description: 'A Single Book',
      args: {
        id: {type : GraphQLInt}
      },
      resolve: (parent, args) => categorys.find(book=> book.authorId===args.id)
    },
    categorys: {
      type: new GraphQLList(CategoryType),
      description: 'List of All Books',
      resolve: () => categorys
    },
    questions: {
      type: new GraphQLList(QuestionType),
      description: 'List of All Authors',
      resolve: () => questions
    }
  })
})


const CategoryType = new GraphQLObjectType({
  name: 'Categorys',
  description: 'This represents categorys',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    categoryType: {
      type: GraphQLNonNull(GraphQLString)
    },
    question: {
      type: QuestionType,
      resolve: (data) => {
        return questions.filter(el => el.questionId == data.id).map(el2=>el2.answer)
      }
    }  
  })
})

const QuestionType = new GraphQLObjectType({
  name: 'Questions',
  description: 'This represents Questions',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    question: { type: GraphQLNonNull(GraphQLString) },
    categoryId: { type: GraphQLNonNull(GraphQLString) },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve: (question) => {
        return answers.filter(answer => answer.questionId === question.id)
      }
    }  
  })
})

const AnswerType = new GraphQLObjectType({
  name: 'Answers',
  description: 'This represents Answers',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    data: { type: GraphQLNonNull(GraphQLString) },
    questionId: { type: GraphQLNonNull(GraphQLInt) },
  })
})


const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: CategoryType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: categorys.length + 1, name: args.name, authorId: args.authorId }
        categorys.push(book)
        return book
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql : true  
}))

app.listen(8000, () => console.log("Server Running"))

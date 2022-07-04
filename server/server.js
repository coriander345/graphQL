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
const newBooks = require('./data')
const authors = [
  { id: 1, name: 'J. K. Rowling'},
  { id: 2, name: 'J. R. R. Tolkien' },
  { id: 3, name: 'Brent Weeks'}
]
const answers = [
  { id: 1, data: '명량대첩',questionId: 1},
  { id: 2, data: '옥포해전',questionId: 1},
  { id: 3, data: '사천해전',questionId: 1},
  { id: 4, data: '노량해전',questionId: 1},
  {
    id: 5,
    data: '타지마할',
    questionId: 2
  },
  {
    id:6,
    data: '리튬(Lithium)',
    questionId: 3
  },
  
  {
    id: 7,
    data: '무궁화 1호',
    questionId: 4
  },
  {
    id: 8,
    data: '천리안',
    questionId: 4
  },
  {
    id: 9,
    data: '아리랑2호',
    questionId: 4
  },
  {
    id: 10,
    data: '우리별 1호',
    questionId: 4
  },
]


const questions =[
  {
    id: 1,
    question: '이순신 장군이 출전한 최초의 해전이자 조선 수군이 임진왜란에서 처음으로 승리한 전투는?',
    categoryId:1
  },
  {
    id: 2,
    question: '인도 아그라에 위치하고 무굴 제국의 황제 샤 자한이 자신의 총애하였던 부인을 기리기 위해 지은 무덤인 건축물의 이름은?',
    categoryId:1
  },
  {
    id: 3,
    question: '원자번호 3번, 스웨덴의 화학자 요한 아르프베드손이 발견, 베터리의 원료로 사용된다. 암석을 뜻하는 그리스어에서 유래된 이것은 무었일까요?',
    categoryId:2
  },
  {
    id: 4,
    question: '최근 누리호 발사가 성공해서 화제이다. 그렇다면 남아메리카 프랑스령 기아나에 위치한 기아나 우주 센터에서 1992년 8월 11일에 쏘아올려진 대한민국 최초의 인공위성은 무엇일까요?',
    categoryId:2
  }
]

 const categorys = [
  {
     id: 1, name: '역사'
  },
  {
    id: 2, name: '과학'
  },
  {
    id: 3, name: '문화'
  },
 ]

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
    questionId: {
      type: GraphQLNonNull(GraphQLInt)
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
    categoryId: { type: GraphQLNonNull(GraphQLInt) },
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

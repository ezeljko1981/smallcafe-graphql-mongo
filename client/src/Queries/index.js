import { gql } from '@apollo/client';

export const GET_ARTICLES= gql`
{
  getArticles {
    id
    name
    price
    active
  }
}
`;

export const GET_ARTICLE= gql`
query ($id: Int){
  getArticle(id: $id) {
    id
    name
    price
    active
  }
}
`;

export const GET_GUESTORDER= gql`
query ($id: Int){
  getGuestorder(id: $id) {
    id
    id_table
    status
    price
    ordertime
    archieved
  }
}
`;

export const GET_ALLARTICLESINORDER= gql`
query ($id: Int){
  getAllArticlesinorder(id: $id) {
    id_order
    id_article
    quantity
    price_article
    price_total
  }
}
`;

export const GET_GUESTORDERSONTABLE= gql`
query ($id_table: Int){
  getGuestordersOnTable(id_table: $id_table) {
    id
    id_table
    status
    price
    ordertime
  }
}
`;

export const GET_EMPLOYEE=gql`
query ($email: String, $password: String){
  getEmployee(email: $email, password: $password) {
    email
    password
  }
}
`;

export const GET_GUESTORDERS= gql`
{
  getGuestorders{
    id
    id_table
    status
    price
    ordertime
    archieved
  }
}
`;

export const GET_ARTICLESINORDERS= gql`
{
  getArticlesinorders{
    id_order
    id_article
    quantity
    price_article
    price_total
    name
  }
}
`;

export const CREATE_GUESTORDER = gql`
  mutation($id: String!, $id_table: Int!, $price: Float!) {
    createGuestOrder (id:$id, id_table: $id_table, price: $price)
      {
      id
      id_table
      ordertime
      price
      status
      archieved
     }
  }
`;

export const CREATE_ARTICLEINORDER= gql`
  mutation($id_order : String!, $id_article : Int!, $quantity : Int!, $price_article : Float!, $price_total : Float!, $name: String!){
    createArticleInOrder(id_order : $id_order, id_article : $id_article, quantity : $quantity, price_article : $price_article, price_total : $price_total, name: $name)
      {
        id_article
        id_order
        price_article
        price_total
        quantity
        name
       }
  }
`;

export const UPDATE_GUESTORDERSTATUS= gql`
  mutation($id: String!, $status: String!){
    updateGuestOrderStatus(id: $id, status: $status){
      id
      status
    }
  }
`;

export const UPDATE_GUESTORDERARCHIEVED= gql`
  mutation($id: String!, $archieved: Boolean!){
    updateGuestOrderArchieved(id: $id, archieved: $archieved){
      id
      archieved
    }
  }
`;

export const DELETE_GUESTORDERARCHIEVED= gql`
mutation($id: String!){
deleteGuestOrderArchieved(id: $id){
      id
    }
  }
`;

export const DELETE_ARTICLEINORDERARCHIEVED= gql`
mutation($id_order: String!){
deleteArticleInOrderArchieved(id_order: $id_order){
  	id_order
	}
}
`;

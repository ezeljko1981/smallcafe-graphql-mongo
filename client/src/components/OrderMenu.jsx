import React, { useState , useCallback , useEffect} from 'react';
import { useQuery , useMutation } from '@apollo/client';
import { GET_ARTICLES, CREATE_GUESTORDER, CREATE_ARTICLEINORDER , GET_GUESTORDERSONTABLE, UPDATE_GUESTORDERSTATUS } from "./../Queries";
import { Spinner } from 'reactstrap';
import Button from "react-bootstrap/Button";
import './../App.css';

function OrderMenu() {
  const getArticles = useQuery(GET_ARTICLES);
  const [updateGuestOrderStatus] = useMutation(UPDATE_GUESTORDERSTATUS);
  const [createGuestOrder] = useMutation(CREATE_GUESTORDER
        , {onCompleted: (data) => {
          console.log("CREATE_GUESTORDER OK");
          console.log(data.createGuestOrder.id);
          if(data.createGuestOrder.id !== "")
            {
              console.log("Success.")
              document.getElementById("btnMakeOrder").style.display = "none";
              let chartBackup = document.getElementById("chartContent").innerHTML;
              chartBackup += "<h1>Ordered!</h1>";
              document.getElementById("chartContentBackup").innerHTML = chartBackup;
              setArrayOfOrders(arrayOfOrdersInit);
              setTotalPrice(0);
            }
            else {console.log("Fail.")}
        }},
        {onError: () => {console.log("Greska createGuestOrder")}}
      );
  const [createArticleInOrder] = useMutation(CREATE_ARTICLEINORDER);
  var arrayOfOrdersInit = [0,0,0,0,0];
  var orderIdRandom = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

  const[currentTable, setCurrentTable] = useState(null);
  const getGuestordersOnTable = useQuery(GET_GUESTORDERSONTABLE, {
      variables: {id_table: currentTable},
      pollInterval: 5000,
    });
  const[arrayOfOrders, setArrayOfOrders] = useState(arrayOfOrdersInit);
  const[totalPrice, setTotalPrice] = useState(0);
  const[errorReport, setErrorReport] = useState("");
  const[currentDateTime, setCurrentDateTime] = useState(Date.now());

  const onAddArticle = useCallback((articleId: Int) =>{
    let tempArray = arrayOfOrders;
    tempArray[articleId] = tempArray[articleId] + 1;
    setArrayOfOrders(tempArray);
  },[arrayOfOrders]);

  const onSubstractArticle = useCallback((articleId: Int) =>{
    let tempArray = arrayOfOrders;
    if(tempArray[articleId]>0){
    tempArray[articleId] = tempArray[articleId] - 1;}
    setArrayOfOrders(tempArray);
  },[arrayOfOrders]);

 const onSetTableId = useCallback((tableId: Int) =>{
    setCurrentTable(tableId)
    let tempArray = arrayOfOrders;
    tempArray[0] = tableId;
    setArrayOfOrders(tempArray);
  },[arrayOfOrders]);

  const onReset = useCallback(() => {
    setTotalPrice(0);
  },[]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every 10 second!');
      setCurrentDateTime(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (getArticles.loading)  return <Spinner color="dark" />;
  if (getArticles.error)    return <React.Fragment>Error :( [no articles]</React.Fragment>;

  return (
    <div className="App">
      <p>Instructions: First select table, then articles, and finally make order.</p>
      <p id="errorreport">{errorReport}</p>
      {currentTable < 1 &&
        <pre>
        <button class="btn-table" onClick={() => {onSetTableId(1)}}><i class="material-icons">free_breakfast</i> Table 1</button>&nbsp;
        <button class="btn-table" onClick={() => {onSetTableId(2)}}><i class="material-icons">free_breakfast</i> Table 2</button><br/>
        <button class="btn-table" onClick={() => {onSetTableId(3)}}><i class="material-icons">free_breakfast</i> Table 3</button>&nbsp;
        <button class="btn-table" onClick={() => {onSetTableId(4)}}><i class="material-icons">free_breakfast</i> Table 4</button>
        </pre> }
      {currentTable > 0 && <p id="tableselected">Table selected: {currentTable}</p>}

      <form onSubmit={e => {
          e.preventDefault();
          createGuestOrder({ variables: { id: orderIdRandom, id_table: arrayOfOrders[0], price: totalPrice }})
              .catch(error => {
              setErrorReport("Error inserting your order! 1 ");
            });
            getArticles.data.getArticles.filter(article => arrayOfOrders[article.id] > 0)
            .map(article => (
              createArticleInOrder({ variables: { id_order: orderIdRandom, id_article: article.id, quantity: arrayOfOrders[article.id], price_article: article.price, price_total:article.price * arrayOfOrders[article.id], name: article.name
              }}).catch(error => { setErrorReport("Error inserting your order! 2 "); })
            ));
            setErrorReport("");
            document.getElementById("menu").style.display = "none";
        }}>
        {(totalPrice > 0) && (arrayOfOrders[0] !== 0) && <button class="btn-table" id="btnMakeOrder" type="submit"><i class='fas fa-check'></i> Make order!</button>}
      </form>
      <form onSubmit={e => { onReset(); setArrayOfOrders(arrayOfOrdersInit);}}>
          <button class="btn-table" id="btnReset" type="submit"><i class="fa fa-refresh"></i> Reset</button>
      </form>

      {currentTable > 0 &&
        <pre id="menu" class="table-center">
        <p><b> MENU:</b></p>
          {getArticles.data.getArticles
            .filter(article => article.active)
            .map(article => (
              <div key={article.id}>
               <p>
                {article.name} - {article.price.toFixed(2)} $
                <br/>
                <button class="btn-counter" onClick={() => {
                  onAddArticle(article.id);
                  setTotalPrice(totalPrice + article.price);
                }}><i class="fa fa-cart-plus"></i></button>
                &nbsp; {arrayOfOrders[article.id]}
                &nbsp;<button class="btn-counter" onClick={() => {
                  if(arrayOfOrders[article.id]>0){ setTotalPrice(totalPrice - article.price);}
                  onSubstractArticle(article.id);
                }}><i class="fa fa-cart-arrow-down"></i></button>
               </p>
              </div>
          ))}
        </pre>
      }
      <pre id = "chartContent">
        {totalPrice>0 && <p id="chartStatus"><b>SELECTED ITEMS: </b></p>}
          {getArticles.data.getArticles.filter(article => arrayOfOrders[article.id] > 0).map(article => (
            <p key={article.id}>
              {article.name}
              &nbsp;{arrayOfOrders[article.id]} x {article.price.toFixed(2)} $
              &nbsp;&nbsp;<b>{(arrayOfOrders[article.id] * article.price).toFixed(2)} $</b>
            </p>
          ))}
          {totalPrice>0 && <p class="overline">Total price: <b>{totalPrice.toFixed(2)} $</b></p>}
      </pre>
      <pre id="chartContentBackup"></pre>
      <pre id="statusOfOrder">
        <div class="table-center"><table>
        {getGuestordersOnTable.data && getGuestordersOnTable.data.getGuestordersOnTable
          .map(order => (<tr class="row-low-line">
            <td class="right">
            Order <b>{order.id}</b>, with price <b>{order.price.toFixed(2)} $&nbsp;</b><br/>
            was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s)</b> ago.
            Status: <b>{order.status}</b>&nbsp;
            </td><td>
            {order.status === "ordered" &&
            <button class="btn-table" type="submit" onClick={() => { updateGuestOrderStatus({variables: {id: order.id,        status: "canceled by guest" }}); }}>Cancel</button>}
        </td></tr>
        ))}
        </table></div>
      </pre>
    </div>
  );
}

export default OrderMenu;

import React, { useState,  useEffect} from 'react';
import { useQuery, useMutation } from "@apollo/client"
import { GET_GUESTORDERS, GET_ARTICLESINORDERS, UPDATE_GUESTORDERSTATUS , UPDATE_GUESTORDERARCHIEVED , DELETE_GUESTORDERARCHIEVED , DELETE_ARTICLEINORDERARCHIEVED } from "./../Queries";
import Button from "react-bootstrap/Button";
import { Spinner } from 'reactstrap';
import "./../WaiterPanel.css";
import './../App.css';

function WaiterPanel(props) {
  const getGuestorders = useQuery(GET_GUESTORDERS, {  pollInterval: 5000, });
  const getArticlesinorders = useQuery(GET_ARTICLESINORDERS, {  pollInterval: 4500, });
  const [updateGuestOrderStatus] = useMutation(UPDATE_GUESTORDERSTATUS);
  const [updateGuestOrderArchieved] = useMutation(UPDATE_GUESTORDERARCHIEVED);
  const [currentDateTime, setCurrentDateTime] = useState(Date.now());
  const [deleteGuestOrderArchieved] = useMutation(DELETE_GUESTORDERARCHIEVED);
  const [deleteArticleInOrderArchieved] = useMutation(DELETE_ARTICLEINORDERARCHIEVED);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (getGuestorders.loading || getArticlesinorders.loading)  return <Spinner color="dark" />;
  if (getGuestorders.error   || getArticlesinorders.error)    return <React.Fragment>Error :(. [WaiterPanel.jsx]</React.Fragment>;
  if (props.waitername === "") return <p>Not loggend in</p>

  return (
    <div>
      <h4><i class='far fa-money-bill-alt' style={{color:'green'}} ></i> Waiter Panel <i class='far fa-money-bill-alt' style={{color:'green'}}></i>
        <br/>
        <h6>Waiter: {props.waitername}</h6>
          <div class="table-center">
            <a class="menu-link-colors" href="#tab1">Ordered</a>&nbsp;&nbsp;&nbsp;
            <a class="menu-link-colors" href="#tab2">Processed</a>&nbsp;&nbsp;&nbsp;
            <a class="menu-link-colors" href="#tab3">Finished</a>&nbsp;&nbsp;&nbsp;
            <a class="menu-link-colors" href="#tab4">Canceled</a>&nbsp;&nbsp;&nbsp;
            <a class="menu-link-colors" href="#tab5">Archieved</a>
          </div>
      </h4>


      <div id="tab1" class="tab-content">
        <h4>Ordered</h4>
        <div class="table-center"><table border="0">
        {getGuestorders.data && getGuestorders.data.getGuestorders
            .filter(order => (order.archieved === false))
            .filter(order => (order.status === "ordered"))
            .map(order => (
            <tr><td class="right"><p>Order <b>{order.id}</b>,
            was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s)</b> ago, on table <b>{order.id_table}</b>:
            <div id={order.id}><i>
            {getArticlesinorders.data && getArticlesinorders.data.getArticlesinorders
              .filter(article => (article.id_order === order.id))
              .map(article => (<p key={article.id} class="nobottommargin">
                <b>{article.name}:</b> {article.quantity} x {article.price_article.toFixed(2)} $  <b>{article.price_total.toFixed(2)} $</b></p>))}
            </i></div>
            <b class="overline">Total price: {order.price.toFixed(2)} $</b><br/>
            <div class="table-right"><table><tr><td>
              <form onSubmit={e => { e.preventDefault();
              updateGuestOrderStatus({variables: {id: order.id, status: "canceled by " + props.waitername}});    }}>
              <button class="btn-table" type="submit">Cancel</button>
              </form></td><td>
              <form onSubmit={e => { e.preventDefault();
              updateGuestOrderStatus({variables: {id: order.id, status: "processing" }});   }}>
              <button  class="btn-table" type="submit">Process</button>
              </form>
            </td></tr></table></div>
            <hr/>
          </p></td></tr>
        ))}</table></div>
      </div>

      <div id="tab2" class="tab-content">
      <h4>Processed orders</h4>
      <div class="table-center"><table border="0">
      {getGuestorders.data && getGuestorders.data.getGuestorders
          .filter(order => (order.archieved === false))
          .filter(order => (order.status === "processing"))
          .map(order => (<tr><td class="right"><p>Order <b>{order.id}</b>,
          was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s)</b> ago, on table <b>{order.id_table}:</b>
          <div id={order.id}><i>
          {getArticlesinorders.data && getArticlesinorders.data.getArticlesinorders
            .filter(article => (article.id_order === order.id))
            .map(article => (<p key={article.id} class="nobottommargin">
              <b>{article.name}:</b> {article.quantity} x {article.price_article.toFixed(2)} $  <b>{article.price_total.toFixed(2)} $</b></p>))}
          </i></div>
          <b class="overline">Total price: {order.price.toFixed(2)} $</b><br/>
          <div class="table-right"><table><tr><td>
              <form onSubmit={e => { e.preventDefault();
              updateGuestOrderStatus({variables: {id: order.id, status: "finished by " + props.waitername }});   }}>
              <button class="btn-table" type="submit">Finished</button>
              </form></td><td>
              <form onSubmit={e => { e.preventDefault();
              updateGuestOrderStatus({variables: {id: order.id, status: "canceled by " + props.waitername }});  }}>
              <button  class="btn-table" type="submit">Cancel</button>
              </form></td></tr></table></div>
          <hr/>
        </p></td></tr>
      ))}</table></div>
      </div>

      <div id="tab3" class="tab-content">
      <h4>Finished orders</h4>
      <div class="table-center"><table border="0">
      {getGuestorders.data && getGuestorders.data.getGuestorders
          .filter(order => (order.archieved === false))
          .filter(order => (order.status.includes("finished")))
          .map(order => (<tr><td class="right"><p>Order <b>{order.id}</b>,
          was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s)</b> ago, on table <b>{order.id_table}</b>
          <br/>&nbsp;Status: <b>{order.status}</b>
          <div id={order.id}><i>
          {getArticlesinorders.data && getArticlesinorders.data.getArticlesinorders
            .filter(article => (article.id_order === order.id))
            .map(article => (<p key={article.id} class="nobottommargin">
              <b>{article.name}:</b> {article.quantity} x {article.price_article.toFixed(2)} $  <b>{article.price_total.toFixed(2)} $</b></p>))}
          </i></div>
          <b class="overline">Total price: {order.price.toFixed(2)} $</b><br/>
          <div class="table-right"><table><tr><td>
            <form onSubmit={e => { e.preventDefault();
              updateGuestOrderArchieved({variables: {id: order.id, archieved: true }}); }}>
              <button class="btn-table" type="submit">Archieve</button>
            </form>
          </td></tr></table></div>
          <hr/>
        </p></td></tr>
      ))}</table></div>
      </div>

      <div id="tab4" class="tab-content">
      <h4>Canceled orders</h4>
      <div class="table-center"><table border="0">
      {getGuestorders.data && getGuestorders.data.getGuestorders
          .filter(order => (order.archieved === false))
          .filter(order => (order.status.includes("canceled")))
          .map(order => (<tr><td class="right"><p>Order code <b>{order.id}</b>,
          was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s) ago,</b><br/> on table <b>{order.id_table}</b>
          &nbsp;Status: <b>{order.status}</b>
          <div id={order.id}><i>
          {getArticlesinorders.data && getArticlesinorders.data.getArticlesinorders
            .filter(article => (article.id_order === order.id))
            .map(article => (<p key={article.id} class="nobottommargin">
              <b>{article.name}:</b> {article.quantity} x {article.price_article.toFixed(2)} $  <b>{article.price_total.toFixed(2)} $</b></p>))}
          </i></div>
          <b class="overline">Total price: {order.price.toFixed(2)} $</b><br/>
          <div class="table-right"><table><tr><td>
            <form onSubmit={e => { e.preventDefault();
              updateGuestOrderArchieved({variables: {id: order.id, archieved: true }}); }}>
              <button class="btn-table" type="submit">Archieve</button>
              </form>
            </td></tr></table></div>
          <hr/>
        </p></td></tr>
      ))}</table></div>
      </div>

      <div id="tab5" class="tab-content">
      <h4>Archieved orders</h4>
      <div class="table-center"><table border="0">
      {getGuestorders.data && getGuestorders.data.getGuestorders
          .filter(order => (order.archieved === true))
          .map(order => (<tr><td class="right"><p>Order code <b>{order.id}</b>,
          was <b>{Math.ceil(Math.abs(currentDateTime - new Date(order.ordertime))/60000)} minute(s) ago,</b><br/> on table <b>{order.id_table}</b>
          &nbsp;Status: <b>{order.status}</b>
          <div id={order.id}><i>
          {getArticlesinorders.data && getArticlesinorders.data.getArticlesinorders
            .filter(article => (article.id_order === order.id))
            .map(article => (<p key={article.id} class="nobottommargin">
              <b>{article.name}:</b> {article.quantity} x {article.price_article.toFixed(2)} $  <b>{article.price_total.toFixed(2)} $</b></p>))}
          </i></div>
          <b class="overline">Total price: {order.price.toFixed(2)} $</b><br/>

          <div class="table-right"><table><tr><td>
            <form onSubmit={e => {
              e.preventDefault();
              deleteGuestOrderArchieved({variables: {id: order.id}});
              deleteArticleInOrderArchieved({variables: {id_order: order.id}});
              }}>
              <button class="btn-table" type="submit">Delete</button>
              </form>
          </td></tr></table></div>

          <hr/>
        </p></td></tr>
      ))}</table></div>
      </div>

    </div>
  );
}

export default WaiterPanel;

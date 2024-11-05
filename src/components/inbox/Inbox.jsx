//placeholder for inbox, more to come with socket-io code
import "../../styles/Inbox.css";

export default function Inbox() {
  return (
    <>
      <h2 className="placeholder">
        This is a placeholder for our messaging app. Your inbox will go here.
      </h2>
      <div className="inboxMain">
        <aside className="conversations">
          <h3 className="convos">Conversations</h3>
          <div className="convoCard">
            <h4>John Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Bob Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Sarah Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Joe Johnson</h4>
            <p>Click to view conversation</p>
          </div>
        </aside>
        <article className="conversation">
          <h3 className="convoWith">John Johnson</h3>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <p className="recieved message">This is a test Received message</p>
          <p className="sent message">This is a test sent message</p>
          <div className="compose">
            <input className="newMessage" type="text" />
            <button className="send">Send</button>
          </div>
        </article>
      </div>
    </>
  );
}

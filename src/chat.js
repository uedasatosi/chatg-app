import React,{ useCallback, useEffect, useState, useRef , number} from 'react';
import axios from 'axios';
import'./chat.css';
 
const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = process.env.API_KEY;
const Chat = () => {
  // メッセージの状態管理用のステート
  const [ message, setMessage ] = useState( '' );
  // 回答の状態管理用のステート
  const [ answer, setAnswer ] = useState( '' );
  // 会話の記録用のステート
  const [ conversation, setConversation ] = useState( [] );
  // ローディング表示用のステート
  const [ loading, setLoading ] = useState( false );
  // 前回のメッセージの保持、比較用
  const prevMessageRef = useRef( '' );
 
  // 回答が取得されたとき
  useEffect( () => {
    // 直前のチャット内容
    const newConversation = [
      {
        'role': 'assistant',
        'content': answer,
      },
      {
        'role': 'user',
        'content': message,
      }
    ];

    // 会話の記録(直前のチャット内容の追加)
    setConversation( [ ...conversation, ...newConversation ] );
 
    // メッセージの消去(フォームのクリア)
    setMessage( '' );
  }, [ answer ] );
 
  // フォーム送信時の処理
  const handleSubmit = useCallback( async ( event ) => {
    event.preventDefault();
 
    // フォームが空のとき
    if ( !message ) {
      alert( 'メッセージがありません。' );
      return;
    }
 
    // APIリクエスト中はスルー
    if ( loading ) return;
 
    // APIリクエストを開始する前にローディング表示を開始
    setLoading( true );
 
    try {
      // API リクエスト
      const response = await axios.post( `${ API_URL }chat/completions`, {
        model: MODEL,
        messages: [
          ...conversation,
          {
            'role': 'user',
            'content': message,
          },
        ],
      }, {
        // HTTPヘッダー(認証)
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ API_KEY }`
        }
      });
 
      // 回答の取得
      setAnswer( response.data.choices[0].message.content.trim() );
 
    } catch ( error ) {
      // エラーハンドリング
      console.error( error );
 
    } finally {
      // 後始末
      setLoading( false );  // ローディング終了
      prevMessageRef.current = message; // 今回のメッセージを保持
    }
  }, [ loading, message, conversation ] );
 
  // チャット内容
  const ChatContent = React.memo( ( { prevMessage, answer } ) => {
    return (
      <div className='result'>
        <div className='current-message'>
          <h2>質問:</h2>
          <p>{ prevMessage }</p>
        </div>
        <div className='current-answer'>
          <h2>回答:</h2>
          <p>{ answer.split( /\n/ )
                .map( ( item, index ) => {
                  return (
                    <React.Fragment key={ index }>
                      { item }
                      <br />
                    </React.Fragment>
                  );
                } )
              }
          </p>
        </div>
        
      </div>
    )
  } );

  const [count,setCount] =useState(0);     
    const onClickcount = () =>{
      setCount(count +1);
      number = setCount.value;
    };

  //onXlickAdd関数(コメントボタンが押されたときの機能）を定義
  const onClickAdd = () => {
    const textEl = document.getElementById("add-text");
    const text = textEl.value;
    textEl.value = "";
    if(text === ""){
      alert("何やってんだお前ええええ");
      return;
  }
  
  const li = document.createElement("li");
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = text;
  const button = document.createElement("button");
    button.textContent = "不適切";
  // const btn = document.createElement("button");
  //  btn.textContent = "Good"; 
    
    //完了ボタンが押されたときの処理を行う
    button.addEventListener("click",() =>{
      const deleteTarget = button.closest("li");
      document.getElementById("task-list").removeChild(deleteTarget);
  });
  //  btn.onClick = ()=> onClickcount;
  //  let number = onClickcount.value;
  //  const h1 = document.createElement("button");
  //  h1.textContent = number;


  // button.addEventListener("click",()=>{
  //   number = onClickcount;
  // })

    div.appendChild(p);
    // div.appendChild(btn);
    div.appendChild(button);
    li.appendChild(div);
    document.getElementById("task-list").appendChild(li);
      
  };
  

  
  // 回答用のフォームの表示
  return (
    
    <div className='container'>
      <nav>
        <ul class="main-nav">
        <li><a href='#chats'>Chat</a></li>
        <li><a href='#task-list'>comments</a></li>
          <li><a href=''>game1</a></li>
          <li><a href=''>game2</a></li>
        </ul>
      </nav>
      <form className='chat-form' onSubmit={ handleSubmit } id='chats'>
        <label>
          <textarea
            className='message'
            rows='5'
            cols='50'
            value={ message }
            onChange={ e => {
              setMessage( e.target.value ) ;
            } }
          />
        </label>
        <div className='submit'>
          <button type="submit">質問する</button>
        </div>
      </form>
      { loading && (
        <div className='loading'>
          <p>回答中...</p>
        </div>
      ) }
      { answer && !loading && (
        <ChatContent
          prevMessage={ prevMessageRef.current }
          answer={ answer }
        />
      ) }
      <div>
      <table>
        <th>
        <input type="text" placeholder="コメントの入力" id="add-text"/>
        </th>
        <th> 
        <button onClick={onClickAdd} id="add-button">追加</button>
        </th>
      </table>
      </div>
      <div className='containers'>
        <ul id="task-list" ><button onClick={onClickcount}>この質問へのいいね数　{count}</button></ul>
     </div>
    </div>
  );
}
 
export default Chat;
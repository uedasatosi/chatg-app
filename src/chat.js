import React,{ useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
 
const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = '' 
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
 
  // フォームの表示
  return (
    <div className='container'>
      <form className='chat-form' onSubmit={ handleSubmit }>
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
    </div>
  );
}
 
export default Chat;
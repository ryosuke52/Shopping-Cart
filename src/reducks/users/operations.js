import {signInAction, signOutAction, fetchProductsInCartAction, fetchOrdersHistoryAction, fetchProductsInFavoriteAction} from "./actions";
import {push} from 'connected-react-router';
import {auth, db, FirebaseTimestamp} from '../../firebase/index';
import {hideLoadingAction, showLoadingAction} from '../loading/actions';
import {initProductsAction} from '../products/actions';

export const addProductToCart = (addProduct) => {
    return async (dispatch, getState) => {
       const uid = getState().users.uid;
       const cartRef = db.collection('users').doc(uid).collection('cart').doc();
       addProduct['cartId'] = cartRef.id;
       await cartRef.set(addProduct);
       dispatch(push('/'))
    }
};

export const addProductToFavorite = (addFavorite) => {   //気になる商品をお気に入りリストへ追加
   return async (dispatch, getState) => {
       const uid = getState().users.uid;
       const favoriteRef = db.collection('users').doc(uid).collection('favorite').doc();
       addFavorite['favoriteId'] = favoriteRef.id;
       await favoriteRef.set(addFavorite);
       dispatch(push('/'))
   }
}

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
       const uid = getState().users.uid;
       const list = [];

       db.collection('users').doc(uid)
          .collection('orders')
          .orderBy('updated_at', 'desc')
          .get()
          .then(snapshots => {
             snapshots.forEach(snapshot => {
                 const data = snapshot.data();
                 list.push(data)
             });
             dispatch(fetchOrdersHistoryAction(list))
          })
    }
}

export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
       dispatch(fetchProductsInCartAction(products))
    }
};

export const fetchProductsInFavorite = (products) => {   //気になる商品をお気に入りリストへ追加
   return async (dispatch) => {
       dispatch(fetchProductsInFavoriteAction(products))
   }
}

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid
                   
                db.collection('users').doc(uid).get()
                    .then(snapshot => {
                       const data = snapshot.data()

                        dispatch(signInAction({
                           customer_id: (data.customer_id) ? data.customer_id : "",
                           email: data.email,
                           isSignedIn: true,
                           payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                           role: data.role,
                           uid: uid,
                           username: data.username  
                        }))
                    })
            } else {
                dispatch(push('/signin'))
            }
        })
    }
}

export const resetPassword = (email) => {
   return async (dispatch) => {
       if (email === "") {
          alert("必須項目が未入力です")
          return false
       } else {
           auth.sendPasswordResetEmail(email)
               .then(() => {
                   alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
                   dispatch(push('/signin'))
               }).catch(() => {
                   alert('登録されていないメールアドレスです。もう一度ご確認ください。')
               })
       }
   }
}


export const signIn = (email, password) => {
    return async (dispatch) => {
       // Validation
       if (email === "" || password === "") {
          alert("必須項目が未入力です")
          return false
       }

       auth.signInWithEmailAndPassword(email, password)
          .then(result => {
              const user = result.user

              if(user) {
                  const uid = user.uid
                   
                  db.collection('users').doc(uid).get()
                     .then(snapshot => {
                         const data = snapshot.data()

                         dispatch(signInAction({
                           customer_id: (data.customer_id) ? data.customer_id : "",
                           email: data.email,
                           isSignedIn: true,
                           payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                           role: data.role,
                           uid: uid,
                           username: data.username  
                         }))
                         
                         
                         dispatch(push('/'))
                     })
              }
          })
    }
}

export const signUp = (username, email, password, confirmPassword) => {
    return async (dispatch) => {
       // Validation
       if (username === "" || email === "" || password === "" || confirmPassword === "") {
          alert("必須項目が未入力です")
          return false
       }

       if (password !== confirmPassword) {
           alert("パスワードが一致しません。もう一度お試しください。")
           return  false
       }

       return auth.createUserWithEmailAndPassword(email, password)
          .then(result => {
             const user = result.user
             
             if (user) {
                 const uid = user.uid
                 const timestamp = FirebaseTimestamp.now()

                 const userInitialData = {
                     created_at: timestamp,
                     email: email,
                     role: "customer",
                     uid: uid,
                     updated_at: timestamp,
                     username: username
                 }

                 db.collection('users').doc(uid).set(userInitialData)
                    .then(() => {
                        dispatch(push('/'))
                    })
             }
          })
    }
}

export const signOut = () => {
    return async (dispatch, getState) => {
       dispatch(showLoadingAction("Sign out..."));
       const uid = getState().users.uid

       //Delete products from the user's cart
       await db.collection('users').doc(uid).collection('cart').get()
          .then(snapshots => {
              snapshots.forEach(snapshot => {
                  db.collection('users').doc(uid).collection('cart').doc(snapshot.id).delete()
              })
          });
       
       // Sign out with Firebase Authentication
       auth.signOut()
           .then(() => {
               dispatch(signOutAction());
               dispatch(initProductsAction());
               dispatch(hideLoadingAction());
               dispatch(push('/signin'))
           }).catch(() => {
               dispatch(hideLoadingAction());
               throw new Error('ログアウトに失敗しました。')
           })
    }
 };
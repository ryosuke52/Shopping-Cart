const initialState = {
    loading: {
       state: false,
       text: ""
    },
    products: {
       list: []
    },
    users: {
        cart: [],
        favorite: [],
        customer_id: "",
        email: "",
        isSignedIn: false,
        orders: [],
        payment_method_id: "",
        role: "",
        uid: "",
        username: ""
    }
};

export default initialState;
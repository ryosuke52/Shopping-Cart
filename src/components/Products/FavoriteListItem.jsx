import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {makeStyles} from '@material-ui/styles';
import {useSelector} from 'react-redux';
import {db} from '../../firebase/index';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {getUserId} from '../../reducks/users/selectors';

const useStyles = makeStyles({
    list: {
       height: 128
    },
    image: {
       objectFit: 'cover',
       margin: 16,
       height: 96,
       width: 96
    },
    text: {
       width: '100%'
    }
});

const FavoriteListItem = (props) => {
    const classes = useStyles();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);

    const image = props.product.images[0].path;
    const name = props.product.name;
    const price = props.product.price.toLocaleString();
    const size = props.product.size;
    
    const removeProductFromFavorite = (id) => {
       return db.collection('users').doc(uid).collection('favorite').doc(id).delete()
    };

    return (
       <>
          <ListItem className={classes.list}> 
             <ListItemAvatar>
                <img className={classes.image} src={image} alt="お気に入り商品画像"/>
             </ListItemAvatar>
             <div className={classes.text}>
                <ListItemText 
                   primary={name}
                   secondary={"サイズ:" + size}
                />
                <ListItemText 
                   primary={"¥" + price}
                />
             </div>
             <IconButton onClick={() => removeProductFromFavorite(props.product.favoriteId)}>
                 <DeleteIcon />
             </IconButton>
          </ListItem>
          <Divider />
       </>
    );
};

export default FavoriteListItem;
import React, {useCallback} from 'react';
import List from '@material-ui/core/List';
import {useSelector, useDispatch} from 'react-redux';
import {push} from 'connected-react-router';
import {makeStyles} from '@material-ui/styles';
import {GreyButton} from '../components/UIkit';
import {FavoriteListItem} from '../components/Products';
import {getProductsInFavorite} from '../reducks/users/selectors';

const useStyles = makeStyles({
    root: {
        margin: '0 auto',
        maxWidth: 512,
        width: '100%'
    }
})

const FavoriteList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const productsInFavorite = getProductsInFavorite(selector);

    const backToHome = useCallback(() => {
        dispatch(push('/'))
     }, [dispatch]);


    return (
       <section className="c-section-wrapin">
          <h2 className="u-text__headline">
              お気に入り商品
          </h2>
          <List className={classes.root}>
             {productsInFavorite.length > 0 && (
                 productsInFavorite.map(product => <FavoriteListItem key={product.favoriteId} product={product} />)
             )} 
          </List>
          <div className="module-spacer--medium" />
          <div className="p-grid__column">
             <GreyButton label={"シッピングを続ける"} onClick={backToHome} />
          </div>
       </section>
    );
};

export default FavoriteList;
import React, { useCallback } from 'react';
import {push} from 'connected-react-router';
import {GreyButton} from '../components/UIkit';
import { useDispatch } from 'react-redux';

const OrderComplete = () => {
   const dispatch = useDispatch();

    const backToHome = useCallback(() => {
        dispatch(push('/'))
    }, [dispatch]);

    return (
       <section className="c-section-wrapin">
           <div className="module-spacer--medium" />
           <div className="module-spacer--medium" />
           <div className="module-spacer--medium" />
          <h1 className="u-text__headline_for_ordercomplete">
              決済のお手続きは終了いたしました。
          </h1>
          <h2 className="u-text__headline_for_ordercomplete">
              お買い求め頂き誠にありがとうございました。
          </h2>
          <div className="module-spacer--medium" />
          <div className="p-grid__column">
             <GreyButton label={"ショッピングを続ける"} onClick={backToHome}/>
          </div>
       </section>
    );
};

export default OrderComplete;
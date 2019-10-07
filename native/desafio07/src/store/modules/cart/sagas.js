import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import Toast from 'react-native-root-toast';

import api from '../../../services/api';
import navigation from '../../../services/navigation';
import { addToCartSuccess, updateAmountSuccess } from './actions';
import { formatPrice } from '../../../util/format';

function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;
  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    Toast.show('Quantidade fora de estoque', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: 'red',
      textColor: '#FFF',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormated: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));

    navigation.navigate('Cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) {
    Toast.show('Quantidade não pode ser menor do que 1', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: 'red',
      textColor: '#fff',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
    return;
  }

  const stock = yield call(api.get, `/stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    Toast.show('Quantidade fora de estoque', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: 'red',
      textColor: '#fff',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);

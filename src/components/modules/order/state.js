import makeStateAction from 'redux-state-action';
import _ from 'lodash';
import { notifSend } from 'redux-notifications/lib/actions';
import { formatPrice } from '../shared/number_helper';

export const reducerPath = 'ORDERS';
const ORDER_THREATHOLD = 80000;
export const names = {
  selected_dish_tag: {
    type: 'string',
    defaultValue: 'None',
  },
  selected_restaurant: {
    type: 'object',
    defaultValue: {
      name: 'Select a restaurant',
    },
  },
  filtered_dishes: {
    type: 'array',
    defaultValue: [],
  },
  variation_options: {
    type: 'object',
    defaultValue: {},
  },
  current_orders: {
    type: 'object',
    defaultValue: {
      dishes: [],
      total: 0,
      error: '',
    },
  },
};

export const {
  branch,
  reducer,
  actionTypeFactory,
  actionCreatorFactory,
  selectorFactory,
} = makeStateAction({
  reducerPath,
  names,
});

export const selectDishTagSelector = selectorFactory('selected_dish_tag');
export const selectRestaurantSelector = selectorFactory('selected_restaurant');
export const filteredDishesSelector = selectorFactory('filtered_dishes');
export const variationOptionsSelector = selectorFactory('variation_options');
export const currentOrderSelector = selectorFactory('current_orders');

const setSelectDishTagAC = actionCreatorFactory('selected_dish_tag');
const setSelectRestaurantAC = actionCreatorFactory('selected_restaurant');
const setFilteredDishesAC = actionCreatorFactory('filtered_dishes');
const setVariationOptionsAC = actionCreatorFactory('variation_options');
const setCurrentOrderAC = actionCreatorFactory('current_orders');

export const setSelectRestaurant = tag => dispatch => {
  dispatch(setSelectRestaurantAC(tag));
};

export const setSelectDishTag = tag => dispatch => {
  dispatch(setSelectDishTagAC(tag));
};

export const generateInitialCurrentOrder = rawOrderDishes => dispatch => {
  let total = 0;
  _.each(rawOrderDishes, dish => {
    total += dish.price * dish.count;
  });
  const orderDishes = rawOrderDishes.map(orderDish => processDish(orderDish));
  const updatedOrder = {
    total,
    dishes: orderDishes,
    error: '',
  };
  updatedOrder.error =
    updatedOrder.total > ORDER_THREATHOLD
      ? `Order exceed ${formatPrice(ORDER_THREATHOLD)}`
      : '';
  dispatch(setCurrentOrderAC(updatedOrder));
};

const processDish = orderDish => {
  const { dish, count } = orderDish;
  const variation = dish.name.match(/\((.*)\)/);
  const name = variation ? dish.name : `${dish.name} (default)`;
  const returnDish = {
    dish_id: dish.id,
    name,
    count: count || 1,
    dish,
  };
  returnDish.variation = variation
    ? {
      label: `${variation[1]}`,
      value: orderDish.price,
    }
    : {
      label: 'default',
      value: orderDish.price,
    };

  return returnDish;
};

export const setCurrentOrder = (
  dish,
  variation,
  currentOrders,
  type
) => dispatch => {
  const dishName = `${dish.name} (${variation.label})`;
  let newDishList = [...currentOrders.dishes];
  const index = newDishList.findIndex(x => x.name === dishName);
  if (type === 'add') {
    dispatch(notifSend({
      message: 'Order Updated',
      kind: 'success',
      dismissAfter: 1000,
    }));
    if (index === -1) {
      newDishList.push({
        dish_id: dish.id,
        count: 1,
        name: dishName,
        dish,
        variation,
      });
    } else {
      newDishList[index] = Object.assign({}, newDishList[index], {
        count: newDishList[index].count + 1,
      });
    }
  } else if (newDishList[index].count === 1) {
    newDishList = _.without(
      newDishList,
      _.find(newDishList, { name: dishName })
    );
  } else {
    newDishList[index] = Object.assign({}, newDishList[index], {
      count: newDishList[index].count - 1,
    });
  }
  const updatedOrder = Object.assign({}, currentOrders, {
    total:
      currentOrders.total +
      (type === 'add' ? variation.value : -1 * variation.value),
    dishes: newDishList,
  });
  updatedOrder.error =
    updatedOrder.total > ORDER_THREATHOLD
      ? `Order exceed ${formatPrice(ORDER_THREATHOLD)}`
      : '';
  dispatch(setCurrentOrderAC(updatedOrder));
};

export const setFilteredDishes = (tag, dishes) => dispatch => {
  let filtered = [];

  if (!dishes.length) dispatch(setFilteredDishesAC(filtered));

  if (dishes) {
    switch (tag) {
      case 'All Dishes':
        filtered = dishes;
        break;
      default:
        filtered = dishes.filter(item => item.tag.tag === tag);
        break;
    }
  }
  filtered = _.orderBy(filtered, 'price', 'asc');
  filtered = groupVariationToDish(filtered);
  dispatch(setVariationOptionsAC(generateInitialDishSelection(filtered)));
  filtered = groupDishByTag(filtered);
  dispatch(setFilteredDishesAC(filtered));
};

export const setVariationOptions = (
  dishId,
  variation,
  variationOptions
) => dispatch => {
  const newOptions = Object.assign({}, variationOptions, {
    [dishId]: variation,
  });
  dispatch(setVariationOptionsAC(newOptions));
};

export const getUniqueTags = dishes => {
  if (!dishes) return [];
  let tags = _.flattenDeep(dishes);
  tags = _.map(tags, tag => tag.tag);
  tags = _.uniqBy(tags, 'tag');
  return tags;
};

// Helper Methods
const generateInitialDishSelection = dishes => {
  const toReturn = {};
  _.each(dishes, dish => {
    const temp = dish.variations[0].label.split('-')[0].trim();
    const newVal = {
      label: temp,
      value: dish.variations[0].value,
    };
    toReturn[dish.id] = newVal;
  });
  return toReturn;
};

const groupDishByTag = dishes => {
  const listTags = getUniqueTags(dishes);
  const toReturn = [];
  _.each(listTags, tagItem => {
    const tagDish = dishes.filter(item => item.tag.tag === tagItem.tag);
    toReturn.push({
      tag: tagItem.tag,
      dishes: tagDish,
    });
  });
  return toReturn;
};

const groupVariationToDish = dishes => {
  const newDishes = [];
  _.each(dishes, dish => {
    const name = `${dish.name}`.substr(0, `${dish.name}`.indexOf('(')).trim();
    const variation = dish.name.match(/\((.*)\)/);
    if (variation) {
      // find existing dish
      const index = newDishes.findIndex(x => x.name === name);
      // if found
      if (index !== -1) {
        newDishes[index].variations.push({
          label: `${variation[1]} - ${formatPrice(dish.price)}`,
          value: dish.price,
        });
      } else {
        const updated = {
          variations: [
            {
              label: `${variation[1]} - ${formatPrice(dish.price)}`,
              value: dish.price,
            },
          ],
          ...dish,
        };
        updated.name = `${dish.name}`
          .substr(0, `${dish.name}`.indexOf('('))
          .trim();
        newDishes.push(updated);
      }
    } else {
      const noVarDish = {
        variations: [
          {
            label: `default - ${formatPrice(dish.price)}`,
            value: dish.price,
          },
        ],
        ...dish,
      };
      newDishes.push(noVarDish);
    }
  });
  return newDishes;
};

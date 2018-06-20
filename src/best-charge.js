const loadPromotions = require('./promotions')
const allItems = require('./items')()

function getBillItems(selectedItem) {
  let promotions = loadPromotions();
  let halfDiscountItems = promotions[1].items;
  let discount = 1;

  let [id, count] = selectedItem.split(' x ')
  let {price, name} = allItems.find(i => i.id === id);
  if (halfDiscountItems.includes(id)) {
    discount = 0.5;
  }
  return {name, count, discount, price};
}

function printReceipt(billItems, savedMoney, promotion, total) {
  let receipt = ''
  receipt += '============= 订餐明细 =============\n';
  billItems.forEach(item => {
    receipt += `${item.name} x ${item.count} = ${item.price * item.count}元\n`
  })
  if(savedMoney > 0) {
    receipt += '-----------------------------------\n';
    receipt += '使用优惠:\n';
    receipt += promotion === '2' ? '指定菜品半价(黄焖鸡，凉皮)': '满30减6元';
    receipt += `，省${savedMoney}元\n`;
  }
  receipt += '-----------------------------------\n';
  receipt += `总计：${total}元\n`;
  receipt += '===================================';
  return receipt;
}

function bestCharge(selectedItems) {
  let originalTotal = 0,
    totalByPromotion1 = 0,
    totalByPromotion2 = 0,
    savedMoney = 0,
    paidMoney = 0,
    usedPromotion = '1';

  const billItems = selectedItems
    .map(getBillItems);

  billItems.forEach(item => {
      originalTotal += item.price * item.count;
      totalByPromotion2 += item.discount * item.price * item.count;
    });

  totalByPromotion1 = originalTotal >= 30 ? originalTotal - 6 : originalTotal;

  if(totalByPromotion2 < totalByPromotion1) {
    usedPromotion = '2';
    savedMoney = originalTotal - totalByPromotion2;
    paidMoney = totalByPromotion2;
  } else {
    savedMoney = originalTotal - totalByPromotion1;
    paidMoney = totalByPromotion1;
  }
  return printReceipt(billItems, savedMoney, usedPromotion, paidMoney)
}

module.exports = bestCharge

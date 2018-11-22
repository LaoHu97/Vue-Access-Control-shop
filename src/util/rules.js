export const validatorAmount = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入退款金额'));
  } else if (!
    /^(([1-9][0-9]*)|([0]\.[1-9]{1})|([0]\.[1-9][0-9]{1})|([0]\.[0-9][1-9]{1})|([1-9][0-9]*\.\d{0,2}))$/.test(
      value)) {
    callback(new Error('请输入正确的退款金额'));
  } else {
    callback();
  }
};

//中国时区
export const getChinaTime = time => {
    let date = new Date(time);
  return (
    date.getFullYear() + "-" + getNum(date.getMonth() + 1) + "-" + getNum(date.getDate()) + ' ' + getNum(date.getHours()) + ':' + getNum(date.getMinutes()) + ':' + getNum(date.getSeconds())
  );
}


//自动补零
 let getNum = num => num < 10 ? '0'+num : num 
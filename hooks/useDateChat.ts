import { IDM, IChat } from '@typings/db';
import dayjs from 'dayjs';
import { useRef } from 'react';

/* 
resultObj = {
  2020: []
  2021: []
} 
*/
// resultObj[key] = [1,2,3,4,5]
export default function useDateChat(objData: IDM[] | IChat[]) {
  const resultObj: { [key: string]: (IDM[] | IChat[]) } = {};
  objData?.forEach((v) => {
    const day = dayjs(v.createdAt).format('YYYY-MM-DD');
    if(resultObj[day] !== undefined) {
      resultObj[day].push(v);
    } else {
      resultObj[day] = [v];
    }
  });

  return resultObj;
}
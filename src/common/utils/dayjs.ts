import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ko');
dayjs.tz.setDefault('Asia/Seoul');
dayjs.extend(isBetween);

export default dayjs;

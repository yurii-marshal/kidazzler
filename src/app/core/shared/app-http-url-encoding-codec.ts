import { HttpUrlEncodingCodec } from '@angular/common/http';

export class AppHttpUrlEncodingCodec extends HttpUrlEncodingCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rewardPipe',
})
export class DashboardRewardPipe implements PipeTransform {
  transform(reward: number) {
    const rewardArr = reward
      .toFixed(2)
      .toString()
      .split('.');
    rewardArr[0] = `
      <span class="rewards-sum__sub">$</span>
      <span class="rewards-sum__main">${rewardArr[0]}</span>
    `;
    rewardArr[rewardArr.length - 1] = `<span class="rewards-sum__sub">.${
      rewardArr[rewardArr.length - 1]
    }/mo</span>`;
    return rewardArr.join('');
  }
}

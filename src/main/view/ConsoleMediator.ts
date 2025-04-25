import { INotification, Mediator } from '@puremvc/puremvc-typescript-multicore-framework'

export class ConsoleMediator extends Mediator {
  static NAME = 'ConsoleMediator'
  static CONSOLE_MESSAGE = '/console/message'

  constructor(viewComponent) {
    super(ConsoleMediator.NAME, viewComponent)
  }

  public override listNotificationInterests(): string[] {
    return [ConsoleMediator.CONSOLE_MESSAGE]
  }

  public override handleNotification(notification: INotification): void {
    const indent = '   '.repeat(Number(notification.type))
    const message = indent.concat(notification.body)
    this.viewComponent.log(message)
  }
}

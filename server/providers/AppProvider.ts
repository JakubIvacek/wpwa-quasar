import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // bind our implementation of MessageRepository to container
    this.app.container.singleton('Repositories/MessageRepository', (container) => {
      // just make instance of app/Repositories/MessageRepository class
      return container.make('App/Repositories/MessageRepository')
    })
    // bind our implementation of ChannelRepository to container
    this.app.container.singleton('Repositories/ChannelRepository', (container) => {
      // just make instance of app/Repositories/ChannelRepository class
      return container.make('App/Repositories/ChannelRepository')
    })
    // bind our implementation of InvitesRepository to container
    this.app.container.singleton('Repositories/InvitesRepository', (container) => {
      // just make instance of app/Repositories/InvitesRepository class
      return container.make('App/Repositories/InvitesRepository')
    })
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}

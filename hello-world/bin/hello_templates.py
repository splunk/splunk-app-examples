import sys
import splunk.admin as admin
import splunk.appbuilder as appbuilder


class HelloTemplates(admin.MConfigHandler):
    handledActions = [admin.ACTION_LIST]

    def setup(self):
        """
        Must be implemented by the derived class.  Defines arguments and validation
        info.  Called before the handle*() functions.
        Should:
          - inspect self.requestedAction.
          - populate self.supportedArgs via addReqArg() and addOptarg().
          - set pipelineName and processorName if appropriate.
        """
        # Throw if requestedAction is incorrect
        # What is supportedArgs?
        # What are pipelineName and ProcessorName?

        if self.requestedAction not in self.handledActions:
            raise admin.BadActionException(
                "This handler does not support this action (%d)." % self.requestedAction)

    def handleCreate(self, confInfo):
        """Called when user invokes the "create" action."""
        self.actionNotImplemented()

    def handleEdit(self, confInfo):
        """Called when user invokes the "edit" action."""
        self.actionNotImplemented()

    def handleList(self, confInfo):
        """Called when user invokes the "list" action."""
        for template in appbuilder.getTemplates():
            confInfo[template].append('text', 'Hello world!')

    def handleMembers(self, confInfo):
        """Called when user invokes the "members" action."""
        self.actionNotImplemented()

    def handleReload(self, confInfo):
        """Called when user invokes the "reload" action."""
        self.actionNotImplemented()

    def handleRemove(self, confInfo):
        """Called when user invokes the "remove" action."""
        self.actionNotImplemented()

    def handleCustom(self, confInfo):
        """
        Called when user invokes a custom action.  Implementer can find out which
        action is requested by checking self.customAction and self.requestedAction.
        The former is a string, the latter an action type (create/edit/delete/etc).
        """
        self.actionNotImplemented()


# initialize the handler
admin.init(HelloTemplates, admin.CONTEXT_APP_AND_USER)

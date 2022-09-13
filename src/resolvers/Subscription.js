function newLinkSubscribe(parent, args, context, info) {
    return context.pubSub.asyncIterator("NEW_LINK");
}

const newLink = {
    subscribe: newLinkSubscribe,
    resolve: payload => { return payload},
}

function newVoteSubscription(parent, args, context) {
    return context.pubSub.asyncIterator("NEW_VOTE")
}

module.exports = {
    newLink,
}
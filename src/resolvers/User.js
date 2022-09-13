async function links(parent, args, context) {
    return context.prisma.user.findUnique({ where: { id: parent.id}}).links();
}

async function votes(parent, args, context) {
    return context.prisma.user.findUnique( { where: { id: parent.id}}).votes();
}

module.exports = {
    links,
    votes,
}
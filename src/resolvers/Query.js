async function feed (parent, args, context) {
    return context.prisma.link.findMany();
}

function link (parent, args) {
    return links.find((link) => link.id == args.id);
}

module.exports = {
    feed,
    link
}
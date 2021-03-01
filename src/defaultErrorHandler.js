const unescapeLideFeed = str => str.replace(/\\n/g, '\n')

export default t => e => {
    e && t.fail(unescapeLideFeed(e))
};

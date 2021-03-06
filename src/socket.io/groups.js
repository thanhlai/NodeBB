"use strict";

var	groups = require('../groups'),
	meta = require('../meta'),

	SocketGroups = {};

SocketGroups.join = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	if (meta.config.allowPrivateGroups !== '0') {
		groups.isPrivate(data.groupName, function(err, isPrivate) {
			if (isPrivate) {
				groups.requestMembership(data.groupName, socket.uid, callback);
			} else {
				groups.join(data.groupName, socket.uid, callback);
			}
		});
	} else {
		groups.join(data.groupName, socket.uid, callback);
	}
};

SocketGroups.leave = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.leave(data.groupName, socket.uid, callback);
};

SocketGroups.grant = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.ownership.grant(data.toUid, data.groupName, callback);
	});
};

SocketGroups.rescind = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.ownership.rescind(data.toUid, data.groupName, callback);
	});
};

SocketGroups.accept = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.acceptMembership(data.groupName, data.toUid, callback);
	});
};

SocketGroups.reject = function(socket, data, callback) {
	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.rejectMembership(data.groupName, data.toUid, callback);
	});
};

SocketGroups.update = function(socket, data, callback) {
	if(!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.update(data.groupName, data.values, callback);
	});
};

SocketGroups.create = function(socket, data, callback) {
	if(!data) {
		return callback(new Error('[[error:invalid-data]]'));
	} else if (socket.uid === 0) {
		return callback(new Error('[[error:no-privileges]]'));
	}

	data.ownerUid = socket.uid;
	groups.create(data, callback);
};

SocketGroups.delete = function(socket, data, callback) {
	if(!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.destroy(data.groupName, callback);
	});
};

SocketGroups.cover = {};

SocketGroups.cover.get = function(socket, data, callback) {
	groups.getGroupFields(data.groupName, ['cover:url', 'cover:position'], callback);
};

SocketGroups.cover.update = function(socket, data, callback) {
	if(!data) {
		return callback(new Error('[[error:invalid-data]]'));
	} else if (socket.uid === 0) {
		return callback(new Error('[[error:no-privileges]]'));
	}

	groups.ownership.isOwner(socket.uid, data.groupName, function(err, isOwner) {
		if (!isOwner) {
			return callback(new Error('[[error:no-privileges]]'));
		}

		groups.updateCover(data, callback);
	});
};

module.exports = SocketGroups;

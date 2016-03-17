var Mongoose = require('mongoose');
var Workspaces = require('./models/Workspace.js');
var Reservations = require('./models/Reservation.js');
var ObjectId = require('mongoose').Types.ObjectId; 

Mongoose.connect('mongodb://localhost/bookaspace', function(err) {
    if(err) {
        console.log('DB connection error', err);
    } else {
        console.log('DB connection successful');
    }
});

exports.getWorkspaces = function(req, res, next) {
	Workspaces.find(req.query, function (err, workspaces) {
    	if (err) {
    		return next(err);
    	} else {
    		res.json(workspaces);
    	}
  });
};

exports.getWorkspaceByID = function(req, res, next) {
  Workspaces.findById(req.params.id, function (err, workspace) {
    if (err) {
    	return next(err);
    } else {
    	res.json(workspace);
    }
  });
};

exports.getWorkspacesByAvailability = function(req, res, next) {
    var searchDate = new Date(req.query.year, req.query.month, req.query.day);
    searchDate.setHours(0);
    searchDate.setMinutes(0);
    searchDate.setSeconds(0);

    var query = 
        Workspaces.find(
            { type: req.query.type, $or: [
                {'bookedOn.date': {$ne: searchDate} }, 
                {'bookedOn.block': {$ne: req.query.block}}
            ]
            }, 
            function (err, spaces) {
                if(err) {
                    return next(err);
                } else {
                    res.json(spaces);
                }
        });

};

exports.createWorkspace = function(req, res, next) {
  Workspaces.create(req.body, function (err, workspace) {
    if (err) {
        return next(err);
    } else {
        res.json(workspace);
    }
  });
};

exports.updateWorkspace = function(req, res, next) {
    Workspaces.findByIdAndUpdate(req.params.id, req.body, function (err, workspace) {
        if (err) {
            return next(err);
        } else {
            res.json(workspace);
        }
    });
};

exports.removeWorkspace = function(req, res, next) {
    Workspaces.findByIdAndRemove(req.params.id, req.body, function(err, workspace) {
        if (err) {
            return next(err);
        } else {
            res.json(workspace);
        }
    });
};

exports.createReservation = function(req, res, next) {
    var booking = {
        'reservation': req.body._id,
        'block': req.body.block,
        'date': req.body.dateOf
    };

    console.log(booking);


    Reservations.create(req.body, function(err, reservation) {
        if(err) {
            return next(err);
        } else {
            Workspaces.findOneAndUpdate(
                {_id: req.body.workspaceID},
                {$push: {bookedOn: booking}},
                   function(err, data) {
                      if (err) {
                         return next(err);
                      }
                      res.json(reservation);
                   }
            );
        }
    });
};

exports.getReservationsByUser = function(req, res, next) {

  if ( req.query.user != null ) {

    Reservations.find( {reserverName: req.query.user}, function(err, reservations) {
        if (err) {
            return next(err);
        } else {
            res.json(reservations);
        }
    });

   }
   else if (req.query.id != null ) {

    Reservations.find( {"_id": req.query.id }, function(err, reservations) {
        if (err) {
            return next(err);
        } else {
            res.json(reservations);
        }
    });

   }
};

exports.getReservations = function(req, res, next) {
    Reservations.find(req.query, function(err, reservations) {
        if (err) {
            return next(err);
        } else {
            res.json(reservations);
        }
  });
};

exports.getReservation = function(req, res, next) {
    Reservations.findById(req.params.id, function(err, reservation) {
        if (err) {
            return next(err);
        } else {
            res.json(reservation);
        }
    });
}

exports.removeReservation = function(req, res, next) {
    Reservations.findByIdAndRemove(req.params.id, function(err, reservation) {
        if (err) {
            return next(err);
        } else {
            console.log(reservation);
            res.json(reservation);
        }
    });
};

exports.updateReservation = function(req, res, next) {
    Reservations.findByIdAndUpdate(req.params.id, req.body, function (err, reservation) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            res.json(reservation);
        }
    });
};

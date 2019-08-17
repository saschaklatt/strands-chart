import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

/**
 * @fileoverview Converts sequences into strands.
 */
import isNil from "lodash/isNil";
import { inject, increase } from "../utils";
import compose from "lodash/fp/compose";
import { getDomainY, isNilDomain, getDomainSize } from "./strandUtils";

var extract = function extract(key) {
  return function (list) {
    return list.map(function (data) {
      return data && data[key];
    });
  };
};

var makeInitialPair = function makeInitialPair(v) {
  return isNil(v) ? [null, null] : [0, v];
};

var strandFromSequence = function strandFromSequence(seq) {
  return Array.from(seq, makeInitialPair);
};

var moveValue = function moveValue(dx) {
  return function (v) {
    return isNil(v) ? null : v + dx;
  };
};

var setValue = function setValue(x) {
  return function (v) {
    return isNil(v) ? null : x;
  };
};

var extendSilhouette = function extendSilhouette(dir) {
  return function (sil) {
    return function (seq) {
      return sil.map(function (t, i) {
        var dx = seq[i] * dir;
        var move = moveValue(dx);
        return dir < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])];
      });
    };
  };
};

var snuggle = function snuggle(dir) {
  return function (targetStrand) {
    return function (baseStrand) {
      return baseStrand.map(function (pair, i) {
        if (isNilDomain(pair) || isNilDomain(targetStrand[i])) {
          return pair;
        }

        var side = dir < 0 ? 0 : 1;
        var x = targetStrand[i][side];
        var w = getDomainSize(pair);
        var setLeft = setValue(dir < 0 ? x - w : x);
        var setRight = setValue(dir < 0 ? x : x + w);
        return [setLeft(pair[0]), setRight(pair[1])];
      });
    };
  };
};

var makeVerticalStrand = function makeVerticalStrand(x, height) {
  return Array.from({
    length: height
  }, function () {
    return [x, x];
  });
};

var makeInitialSilhouette = function makeInitialSilhouette(height) {
  return makeVerticalStrand(0, height);
};

var makeSilhouette = function makeSilhouette(dataKey) {
  return compose(makeInitialSilhouette, increase, getDomainSize, getDomainY, extract(dataKey));
};

var attachIndex = function attachIndex(strand) {
  return strand.map(function (pair, idx) {
    return [].concat(_toConsumableArray(pair), [idx]);
  });
};

var removeNullValues = function removeNullValues(strand) {
  return strand.filter(function (pair) {
    return !isNilDomain(pair);
  });
};

export var seqs2strands = function seqs2strands(sequences, dataKey) {
  var silhouette = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : makeSilhouette(dataKey)(sequences);
  var strands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

  if (i >= sequences.length) {
    return strands;
  }

  var seq = sequences[i];
  var seqData = seq[dataKey];
  var snuggleWithSilhouette = snuggle(seq.dir)(silhouette);
  var newSilhouette = extendSilhouette(seq.dir)(silhouette)(seqData);
  var makeStrand = compose(removeNullValues, attachIndex, snuggleWithSilhouette, strandFromSequence);
  var newStrands = [].concat(_toConsumableArray(strands), [inject(seq, dataKey, makeStrand(seqData))]);
  return seqs2strands(sequences, dataKey, newSilhouette, newStrands, i + 1);
};
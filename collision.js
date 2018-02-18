/*
	collision.js
	define object and collide function
*/

// Vector2d
var Vector2D = class Vector2D {
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

Vector2D.prototype.Init = function(x,y){
	this.x = x;
	this.y = y;
}

/*
	v: Vector2D
*/
function rotateVector90(v){
	var r = new Vector2D();
	r.x = -v.y;
	r.y = v.x;
	return r;
}

/*
	get degree to radian

	return radian
*/
function getDegreeToRadian(degree){
	var pi = 3.14159265358979323846;

	return degree * pi / 180;
}

/*
	chapter5
	vec:Vector2D

	return Vector2D
*/
function getRotateVector(vec,degree){
	var radian = getDegreeToRadian(degree);

	var sin = Math.sin(radian);
	var cos = Math.cos(radian);

	var r = new Vector2D();
	r.x = vec.x * cos - vec.y * sin;
	r.y = vec.x * sin + vec.y * cos;

	return r;
}

function isEqualVectors(a,b){
	return equalFloats(a.x - b.x,0) && equalFloats(a.y - b.y,0);
}

/**
 * vec:Vector2D
 *
 * return unitVector
 */
function getUnitVector(vec){
	var length = getVectorLength2D(vec);
	if(length > 0){
		return getDivideVector(vec,length);
	}
	return vec;
}

/**
 * return vector length
 *
 * vec:Vector2D
 */
function getVectorLength2D(vec){
	return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

/**
 *
 *
 *
 * return Vector2D
 */
function getDivideVector(vec2D,length){
	vec2D.x = vec2D.x / length;
	vec2D.y = vec2D.y / length;
	return vec2D;
}

function equalFloats(a,b){
	var threshold = 1 / 8192;
	return Math.abs(a - b) < threshold;
}

/*

*/
function isParallelVector(vectorA,vectorB){
	var na = rotateVector90(vectorA);
	return equalFloats(0,dotProduct2D(na,vectorB));
}

function subtractVector(vecA,vecB){
	var vec = new Vector2D();
	vec.x = vecA.x - vecB.x;
	vec.y = vecA.y - vecB.y;
	return vec;
}

function dotProduct2D(vecA,vecB){
	return vecA.x * vecB.x + vecA.y * vecB.y;
}

/**
 * line segment
 *
 * point1:Vector2D
 * point2:Vector2D
*/
var LineSegment2D = class LineSegment2D {
	constructor(point1,point2,color){
		this.point1 = point1;
		this.point2 = point2;
		this.color = color;
	}
}

LineSegment2D.prototype.Draw = function(ctx){
	  ctx.beginPath();
	  ctx.strokeStyle = this.color;
	  ctx.moveTo(this.point1.x,this.point1.y);
	  ctx.lineTo(this.point2.x,this.point2.y);
	  ctx.fill();
	  ctx.stroke();
}

LineSegment2D.prototype.Init = function(point1,point2,color){
	this.point1 = point1;
	this.point2 = point2;
	this.color = color;
}

/*
	Line Object
*/
function Line(){
	// vector2D
	this.base;
	// vector2D
	this.direction
	this.color;
}

Line.prototype.Init = function(base,direction,color){
	this.base = base;
	this.direction = direction;
	this.color = color;
}

Line.prototype.Draw = function(ctx){
	  ctx.beginPath();
	  ctx.fillStyle = this.color;
	  // angler
	  var angler = this.direction.y / this.direction.x;
	  // intersept
	  var intersept = this.base.y - (angler * this.base.x);
	  var distance = 1000;
	  ctx.moveTo(-distance,((-distance * angler) + intersept));
	  ctx.lineTo(distance,(distance * angler) + intersept);
	  ctx.fill();
	  ctx.stroke();
}

/*
	a: Line
	b: Line
*/
function isEquivalentLines(a,b){
	// ベクトルが同じか
	if(!isParallelVector(a.direction,b.direction)){
		return false;
	}

	// 基準点が異なる
	d = subtractVector(a.base,b.base);
	return isParallelVector(d,a.direction);
}

/*
 * 線分
 */

/*
 * 一つの軸を基準にその軸の片側をこえないかどうか
 *
 * axis:Line
 * segment:Segment
 */
function onOneSide(axis,segment){
	var d1 = new Vector2D();
	d1 = subtractVector(segment.point1,axis.base);

	var d2 = new Vector2D();
	d2 = subtractVector(segment.point2,axis.base);

	var n = new Vector2D();
	n = rotateVector90(axis.direction);

	// 同じ方向だということを返す
	return dotProduct2D(n,d1) * dotProduct2D(n,d2) > 0;
}

/**
 * Range
 */
var Range = class Range {
	constructor(min,max){
		this.min = min;
		this.max = max;
	}
}

/**
 * chapter5
 * 2つのRangeクラスにおける
 * 最小値と最大値を設定したRangeクラスを返す
 *
 */
function getMaxMinRange(range1,range2){
	var range = new Range();
	range.min = range1.min < range2.min ? range1.min : range2.min;
	range.max = range1.max < range2.max ? range2.max : range1.max;
	return range;
}

function getSortRange(range){
	var sorted = new Range(range.min,range.max);
	if(range.min > range.max){
		sorted.min = range.max;
		sorted.max = range.min;
	}
	return sorted;
}

/**
 * chapter5
 * oriented rectangle class
 *
 * center:原点から四角形の中心へのベクトル
 * halfExtend:中心から四隅へのベクトル
 * rotation:回転角度
 */
var OrientedRectangle = class OrientedRectangle {
	constructor(center,halfExtend,rotation){
		this.center = center;
		this.halfExtend = halfExtend;
		this.rotation = rotation;
	}
}

/**
 * chapter9
 * oriented rectangle class
 *
 * center:原点から四角形の中心へのベクトル
 * halfExtend:中心から四隅へのベクトル
 * rotation:回転角度
 * color:color
 */
var OrientedRectangle = class OrientedRectangle {
	constructor(center,halfExtend,rotation,color){
		this.center = center;
		this.halfExtend = halfExtend;
		this.rotation = rotation;
		this.color = color;
	}
}

/**
* chapter5
* 回転四角形の描画
*/
OrientedRectangle.prototype.Draw = function(ctx){
	  ctx.beginPath();
	  ctx.fillStyle = this.Color;
	  // define point
	  var point1 = getAddVector(getRotateVector(this.halfExtend,this.rotation),this.center);
	  var point2 = getAddVector(getRotateVector(this.halfExtend,this.rotation + 90),this.center);
	  var point3 = getAddVector(getRotateVector(this.halfExtend,this.rotation + 180),this.center);
	  var point4 = getAddVector(getRotateVector(this.halfExtend,this.rotation + 270),this.center);

	  ctx.moveTo(point1.x,point1.y);
	  ctx.lineTo(point2.x,point2.y);
	  ctx.lineTo(point3.x,point3.y);
	  ctx.lineTo(point4.x,point4.y);
	  ctx.closePath();
	  ctx.stroke();
}

/**
 * chapter5
 *
 * 逆ベクトルを返す
 */
function getNegateVector(vector){
	vector.x = -vector.x;
	vector.y = -vector.y;
	return vector;
}

/**
 * chapter5
 * ベクトル加算
 *
 * vecA:Vector2D
 * vecB:Vector2D
 */
function getAddVector(vecA,vecB){
	return new Vector2D(vecA.x + vecB.x,vecA.y + vecB.y);
}


/**
 * chapter5
 * 四角形の一辺を返す
 * return LineSegment2D
 */
function getOrientedRectangleEdge(orientedRectangle,point){
	var edge = new LineSegment2D();
	// vecAが変わるとVecBも変わってしまう
	var vecA = new Vector2D(orientedRectangle.halfExtend.x,orientedRectangle.halfExtend.y);
	var vecB = new Vector2D(orientedRectangle.halfExtend.x,orientedRectangle.halfExtend.y);

	switch(point % 4){
	case 0:
		// top edge
		vecA.x = -vecA.x;
		break;
	case 1:
		// right edge
		vecB.y = -vecB.y;
		break;
	case 2:
		// bottom edge
		vecA.y = -vecA.y;
		vecB = getNegateVector(vecB)
		break;
	case 3:
		// left edge
		vecA = getNegateVector(vecA);
		vecB.x = -vecB.x;
		break;
	}

	vecA = getRotateVector(vecA,orientedRectangle.rotation);
	vecA = getAddVector(vecA,orientedRectangle.center);

	vecB = getRotateVector(vecB,orientedRectangle.rotation);
	vecB = getAddVector(vecB,orientedRectangle.center);

	edge.point1 = vecA;
	edge.point2 = vecB;
	return edge;
}

/*
	chapter5
	axis:Segment2D
	r:OrientedRectangle
*/
function isSeparatingAxisForOrientedRectangle(axis,r){
	var axisRange = new Range();
	var r0Range = new Range();
	var r2Range = new Range();
	var rProjection = new Range();

	// Segment
	// 上辺と下辺を求める
	var rEdge0 = getOrientedRectangleEdge(r,0);
	var rEdge2 = getOrientedRectangleEdge(r,2);

	var n = subtractVector(axis.point1,axis.point2);
	n = getUnitVector(n);

	axisRange = getProjectSegment(axis,n);
	r0Range = getProjectSegment(rEdge0,n);
	r2Range = getProjectSegment(rEdge2,n);
	rProjection = getMaxMinRange(r0Range,r2Range);

//	console.log("axisRange.min =" + axisRange.min + "axisRange.max =" + axisRange.max);
//	console.log("r0Range.min =" + r0Range.min + "r0Range.max =" + r0Range.max);
//	console.log("r2Range.min =" + r2Range.min + "r2Range.max =" + r2Range.max);
//	console.log("rProjection.min =" + rProjection.min + "rProjection.max =" + rProjection.max);

	return !isOverLappingRanges(axisRange,rProjection);
}

/*
	chapter5
	回転する四角形と四角形の衝突

	r1:OrientedRectangle
	r2:OrientedRectangle

	return boolean

*/
function isOrientedRectangleCollide(r1,r2){
	var edge = getOrientedRectangleEdge(r1,0);
	//console.log(edge.point1.x,edge.point1.y,edge.point2.x,edge.point2.y);
	if(isSeparatingAxisForOrientedRectangle(edge,r2)){
		console.log("section1");
		return false;
	}

	edge = getOrientedRectangleEdge(r1,1);
	if(isSeparatingAxisForOrientedRectangle(edge,r2)){
		console.log("section2");
		return false;
	}

	edge = getOrientedRectangleEdge(r2,0);
	console.log("section3");
	if(isSeparatingAxisForOrientedRectangle(edge,r1)){
		return false;
	}

	edge = getOrientedRectangleEdge(r2,1);
	console.log("section4");
	return !isSeparatingAxisForOrientedRectangle(edge,r1);

}

/**
 * segment:segment
 * onto:Vector2D
 *
 * return Range
 */
function getProjectSegment(segment,onto){
	var ontoUnitVec = getUnitVector(onto);

	var range = new Range();
	range.min = dotProduct2D(ontoUnitVec,segment.point1);
	range.max = dotProduct2D(ontoUnitVec,segment.point2);

	range = getSortRange(range);
	return range;
}

/**
 * range1:Range
 * range2:Range
 *
 * return isOverlap
 */
function isOverLappingRanges(range1,range2){
	return overLapping(range1.min,range1.max,range2.min,range2.max);
}

/**
 * segment1:Segment
 * segment2:Segment
 *
 * return boolean
 */
function isSegmentsCollide(segment1,segment2){
	// 線分の方向をチェックするためのベクトル
	var axisA = new Line();
	var axisB = new Line();

	// 線分1のベクトルに対して、線分2が片側にあるかチェック
	axisA.base = segment1.point1;
	axisA.direction = subtractVector(segment1.point2,segment1.point1);

	if(onOneSide(axisA,segment2)){
		return false;
	}

	// 同じく
	axisB.base = segment2.point1;
	axisB.direction = subtractVector(segment2.point2,segment2.point1);

	if(onOneSide(axisB,segment1)){
		return false;
	}

	// 同じベクトルをもつケース
	if(isParallelVector(axisA.direction,axisB.direction)){
		var rangeA = getProjectSegment(segment1,axisA.direction);
		var rangeB = getProjectSegment(segment2,axisA.direction);

		// 重なっているか
		return isOverLappingRanges(rangeA,rangeB);
	}
	else{
		return true;
	}
}

/**
 * minA:float
 * maxA:float
 * minB:float
 * maxB:float
 */
function overLapping(minA,maxA,minB,maxB){
	return minB <= maxA && minA <= maxB;
}

/*
	円のクラス
*/
function cCircle(){
	this.CenterX;		// 中心座標X
	this.CenterY;		// 中心座標Y
	this.Center;		// vector2d
	this.Radius;		// 半径
	this.Color;			// rgb色
}

/*
	初期化関数
*/
cCircle.prototype.Init = function(x,y,r,color){
	this.CenterX = x;
	this.CenterY = y;
	this.Center = new Vector2D(x,y);
	this.Radius = r;
	this.Color = color;
}

cCircle.prototype.Draw = function(ctx){
	  ctx.beginPath();
	  ctx.fillStyle = this.Color;
	  ctx.arc(this.CenterX, this.CenterY, this.Radius, 0, (2 * Math.PI), true);
	  ctx.fill();
}

/*
	円と円の当たり判定
	circle = cCircleクラス

	return true = 当たった,false = 当たっていない
*/
cCircle.prototype.CollisionCircle = function(circle){
	if((this.CenterX - circle.CenterX) * (this.CenterX - circle.CenterX) + (this.CenterY - circle.CenterY) * (this.CenterY - circle.CenterY) <= (this.Radius + circle.Radius) * (this.Radius + circle.Radius))
	{
		return true;
	}
	return false;
}

/**
 *	 chapter6
 *　　線と円との当たり判定
 */
cCircle.prototype.CollisionLine = function(line){
	var lc = subtractVector(this.Center,line.base);
	var project = projectVector(lc,line.direction);

	var nearest = getAddVector(line.base,project);

	// 円と線と最短距離の点がぶつかっていたら当たっている
	return this.CollisionWithPoint(nearest);
}

/**
 * 	chapter6
 *	円と点との当たり判定
 *
 */
cCircle.prototype.CollisionWithPoint = function(point){
	var distance = subtractVector(this.Center,point);
	return getVectorLength2D(distance) <= this.Radius;
}

/**
 * chapter6
 * 正射影ベクトル
 */
function projectVector(project,onto){
	// 内積を使って長さを求める
	var d = dotProduct2D(onto,onto);

	if(0 < d){
	    var dp = dotProduct2D(project,onto);
	    return multiplyVector(onto,dp / d);
	}
	return onto;
}

/**
 * chapter6
 * ベクトルの掛け算
 * vec = Vector2D
 * scalar = 乗数
 *
 * return Vector2D
 *
*/
function multiplyVector(vec,scalar){
	var temp = new Vector2D();
	temp.x = vec.x * scalar;
	temp.y = vec.y * scalar;
	return temp;
}

/**
	chapter7

	circle = cCircle
	segment = LineSegment2D

*/
function collision_circle_with_segment(circle,segment){
	// segmentの端点がサークル内に存在するか
	if(circle.CollisionWithPoint(segment.point1) || circle.CollisionWithPoint(segment.point2)){
		return true;
	}
	// segmentをベクトルに変換
	var distance = subtractVector(segment.point2,segment.point1);
	// point1から円の中心へのベクトルを求める
	var lc = subtractVector(circle.Center,segment.point1);
	// lcとsegmentとの射影ベクトルを求める
	var project = projectVector(lc,distance);

	// 取得した射影ベクトルとの近接点を求める
	var nearest = getAddVector(segment.point1,project);
	// 近接点が円内部に存在するかつ線分の長さが射影ベクトルの長さ以上かつ線分と射影ベクトルの内積が-である
	return circle.CollisionWithPoint(nearest) && getVectorLength2D(project) <= getVectorLength2D(distance)
	 && 0 <= dotProduct2D(project,distance);
}

/**
 * chapter8
 * 指定した最小値・最大値の値以下を返す
**/
function clampOnRange(x,min,max){
	if(x < min){
		return min;
	}else if(x > max){
		return max;
	}else{
		return x;
	}
}

/**
 * chapter8
 *
 * @param point
 * @param rectangle
 * @returns
 */
function clampOnRectangle(point,rectangle){
	var clamp = new Vector2D();

	clamp.x = clampOnRange(point.x,rectangle.origin.x,rectangle.origin.x + rectangle.size.x );
	clamp.y = clampOnRange(point.y,rectangle.origin.y,rectangle.origin.x + rectangle.size.y );
	return clamp;
}

/**
 * chapter8
 * 円と四角形の当たり判定
 * @param circle cCircle
 * @param rectangle Rectangle
 * @returns
 */
function circleRectangleCollision(circle,rectangle){
	clamped = clampOnRectangle(circle.Center,rectangle);
	return circle.CollisionWithPoint(clamped);
}

/**
 * chapter8
 * 四角形
 *
 * origin:Vector2D widthとheightを伸ばす基準となるポイント
 * size:Vector2D widthとheight
*/
var Rectangle2D = class Rectangle2D {
	constructor(origin,size,color){
		this.origin = origin;
		this.size = size;
		this.color = color;
	}
}

/**
 * chapter8
 * 四角形の描画
 */
Rectangle2D.prototype.Draw = function(ctx){
	  ctx.beginPath();
	  ctx.fillStyle = this.Color;
	  // 始点(左下)
	  ctx.moveTo(this.origin.x,this.origin.y);
	  // 右下
	  ctx.lineTo(this.origin.x + this.size.x,this.origin.y);
	  // 右上
	  ctx.lineTo(this.origin.x + this.size.x,this.origin.y + this.size.y);
	  // 左上
	  ctx.lineTo(this.origin.x,this.origin.y + this.size.y);
	  ctx.closePath();
	  ctx.stroke();
}

Rectangle2D.prototype.Init = function(origin,size,color){
	this.origin = origin;
	this.size = size;
	this.color = color;
}

/**
 * chapter9
 * 円と回転四角形との当たり判定
 *
 * circle:cCircle
 * orientedRectangle: OrientedRectangle
 */
function circleOrientedRectangleCollision(circle,orientedRectangle){
	// 原点を頂点にもつ、回転四角形の角度を0にした四角形を作り出す
	var rectangle = new Rectangle2D();
	rectangle.origin = new Vector2D(0,0);
	rectangle.size = multiplyVector(orientedRectangle.halfExtend,2);

	// 作り出した四角形の位置に対応した円を生成
	var circle2 = new cCircle();
	circle2.Init(0,0,circle.Radius,"rgb(0,0,0)");
	// 回転四角形の原点と円との距離
	var distance = subtractVector(circle.Center,orientedRectangle.center);
	// 四角形と作り出した円との距離を求める
	distance = getRotateVector(distance,-orientedRectangle.rotation);
	// 中心に求めた中心点へのベクトルを代入する
	circle2.Center = getAddVector(distance,orientedRectangle.halfExtend);
	// 円と四角形と当たり判定に互換する
	return circleRectangleCollision(circle2,rectangle);
}

/**
	chapter10
	四角形と線の当たり判定
	line:Line
	rectangle:Rectangle
*/
function lineRectangleCollision(line,rectangle){
	// 当たり判定対象の線に直角のベクトル
	var n = rotateVector90(line.direction);

	// 四角形の四隅の点を求める
	var c1 = new Vector2D(rectangle.origin.x,rectangle.origin.y);
	var c2 = getAddVector(c1,rectangle.size);
	var c3 = new Vector2D(c2.x,c1.y);
	var c4 = new Vector2D(c1.x,c2.y);

	// 四隅の点から線のベースとなる点の距離を求める
	c1 = subtractVector(c1,line.base);
	c2 = subtractVector(c2,line.base);
	c3 = subtractVector(c3,line.base);
	c4 = subtractVector(c4,line.base);

	// 内積におり線の方向を求める
	var dp1 = dotProduct2D(n,c1);
	var dp2 = dotProduct2D(n,c2);
	var dp3 = dotProduct2D(n,c3);
	var dp4 = dotProduct2D(n,c4);

	// 全部同じ方向にあれば、線と四角形が当たっていることはない
	return (dp1 * dp2 <= 0) || (dp2 * dp3 <= 0) || (dp3 * dp4 <= 0);
}

/**
	chapter11
	collision line with point
*/
function linePointCollision(line,point){
	if(pointPointCollision(line.base,point)){
		return true;
	}
	// 点と線のベクトルの向き
	var lp = subtractVector(point,line.base);
	return isParallelVector(lp,line.direction);
}

/**
	chapter11
	collision point with point
*/
function pointPointCollision(point1,point2){
	if(equalFloats(point1.x,point2.x) && equalFloats(point1.y,point2.y)){
		return true;
	}
	return false;
}

/**
	chapter11
	point class
*/
var Point2D = class Point2D {
	constructor(x,y,color){
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

Point2D.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.moveTo(this.x,this.y);
	ctx.lineTo(this.x + 1,this.y + 1);
	ctx.stroke();
}

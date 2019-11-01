export const randomizeArray = (array) => {
	array.sort(function() {
	  return .5 - Math.random();
	});
	return array;
}

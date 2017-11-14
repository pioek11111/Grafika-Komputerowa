function calculatePointOnCircle(alpha, r) {
	return {
		x: r * Math.cos(alpha * Math.PI / 360),
		y: r * Math.sin(alpha * Math.PI / 360)
	}
}


# raycaster-engine

An implementation of the widely popular raycster enginer used in games such as doom and wolfenstein using HTML canvas for rendering graphics and typescript for logic.

## Resouces Used

I used many resourced to learn about the algorithms and the basic math needed to develop this implementation. They are listed below:
- https://www.youtube.com/watch?v=xW8skO7MFYw
  - Descibes the basic theory of how a 3d world can be rendered with rays of 'light' emitted from a source and mapped to columns of pixels on a proj. screen 
- https://stackoverflow.com/questions/24173966/raycasting-engine-rendering-creating-slight-distortion-increasing-towards-edges
  - Selecting angles for rays (error handling for curved edges of screen)
- https://gamedev.stackexchange.com/questions/156842/how-can-i-correct-an-unwanted-fisheye-effect-when-drawing-a-scene-with-raycastin/156853#156853
  - Similar to above (with further description of same distortion) but also described fix for fisheye distortion 
- https://math.stackexchange.com/questions/270194/how-to-find-the-vertices-angle-after-rotation
  - Rotating a point about some other point
- https://math.stackexchange.com/questions/2157931/how-to-check-if-a-point-is-inside-a-square-2d-plane
  - Checking if point is inside a rectangle
- https://onlinemschool.com/math/library/vector/angl/
  - Angle between two vectors

 ### Other Algos
 
 Most algos (collision detection b/w player and wall and bullet and wall, edge of wall detection, etc) made from scratch.
 - Alot of res above were for the square bullets 



https://user-images.githubusercontent.com/37590511/124070596-0e575800-da0c-11eb-859d-254b5296af5c.mp4


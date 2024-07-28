## Color ramps

Color ramps are formed like this:

```cpt
0	255 179 40	  100	86 86 86
100	87 87 87	600	182 182 182
600	87 87 87	1000	255 255 255
B	170, 204, 255
F	145, 111, 111
N	255 0 0
```

The ramps themselves are formatted as
`<key> <r> <g> <b> <key> <r> <g> <b>`

### B  

Defines the color for values below the minimum specified age (0 Ma), using RGB (170, 204, 255)

### F  

Defines the color for values above the maximum specified age (1000 Ma), using RGB (145, 111, 111)

### N

Defines the color for NaN (Not a Number) values (255 0 0)
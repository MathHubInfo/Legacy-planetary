Changeset = require('../types/Changeset')
AttributePool = require('../types/AttributePool')

class PositionIterator
	constructor: (@pm) ->
		@pOffset = 0
		@mline = 0
		@mcol  = 0
		@newOffsets = [0, 0]
		@nLine = 0
	
	skip : (chars) ->
		@pOffset += chars
		while chars > 0
			# chars still stays in the same line
			avail = @pm.offsets[@mline+1]-@pm.offsets[@mline]-@mcol
			if chars < avail
				@newOffsets[@nLine+1] += chars
				@mcol += chars
				break
			@newOffsets[@nLine+1] += avail
			chars -= avail
			@nLine++;
			@mline++
			@mcol=0
			@newOffsets.push(@newOffsets[@nLine])

	insert : (text) ->
		return unless text.length > 0
		for line,i in text.split("\n")
			if i > 0
				@newOffsets.push(++@newOffsets[@nLine+1]);
				@nLine++				
			@newOffsets[@nLine + 1] += line.length
			
	delete : (chars) ->
		@pOffset += chars
		return unless chars > 0
		while chars > 0
			# chars still stays in the same line
			avail = @pm.offsets[@mline+1]-@pm.offsets[@mline]-@mcol
			if chars < avail
				@mcol += chars
				break
			chars -= avail
			@mline++
			@mcol=0
	
	end : () ->
		# chars still stays in the same line
		@skip()

class PositionManager
	
	constructor: (text) ->
		lines = text.split("\n")
		@offsets=[0]
		@count = lines.length
		for line,i in lines
			@offsets[i+1] = @offsets[i] + line.length + 1
		@offsets[@count]--
			
	getOffset : (line, col) ->
		if (line >= @count)
			return -1
		if (@offsets[line+1]-@offsets[line] <= col)
			return -1
		return @offsets[line]+col
		
	getCoords : (offset) ->
		return -1 unless offset < @offsets[@count]
		l = 0; r = @count - 1
		while (l<r)
			m=Math.ceil((l+r)/2)
			om = @offsets[m]; 
			if (om > offset)
				r = m-1
			if (om == offset)
				return {line:m, col:0}
			if (om < offset)
				l=m
		return {line:l, col: offset - @offsets[l]}
	
	length : () ->
		return @offsets[@offsets.length-1]
		
exports.PositionIterator = PositionIterator
exports.PositionManager = PositionManager

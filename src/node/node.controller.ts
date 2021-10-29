import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from "@nestjs/common";
import { ApiBody, ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateNodeDto, NodeDto, UpdateNodeDto } from "./node.dto";
import { NodeService } from "./node.service";

@ApiOAuth2([])
@ApiTags("nodes")
@Controller("nodes")
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  @ApiOperation({ summary: "Create a new node" })
  @ApiBody({ type: CreateNodeDto })
  @ApiResponse({
    status: 200,
    description: "Created node",
    type: NodeDto,
  })
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all nodes" })
  @ApiResponse({
    status: 200,
    description: "All nodes",
    type: [NodeDto],
  })
  findAll() {
    return this.nodeService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a node" })
  @ApiResponse({
    status: 200,
    description: "A node",
    type: NodeDto,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.nodeService.findOne(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateNodeDto })
  @ApiOperation({ summary: "Update a node" })
  @ApiResponse({
    status: 200,
    description: "A node",
    type: NodeDto,
  })
  update(@Param("id", ParseIntPipe) id: number, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodeService.update(id, updateNodeDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a node" })
  @ApiResponse({
    status: 200,
    description: "A node",
    type: NodeDto,
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.nodeService.remove(id);
  }
}

package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacPartsDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.service.RbacPartsService;
import com.icodeview.rock.admin.vo.RbacPartsVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "零件")
@ApiSort(2)
@RestController
@RequestMapping("/parts/partslist")
public class PartsController {
    @Resource
    private RbacPartsService rbacPartsService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "ID"),
            @ApiImplicitParam(name = "name",value = "标题"),
            @ApiImplicitParam(name = "man",value = "生产厂家"),
            @ApiImplicitParam(name = "sup",value = "供货商"),
            @ApiImplicitParam(name = "diposed",value = "已报废"),
            @ApiImplicitParam(name = "remain",value = "库存"),
            @ApiImplicitParam(name = "used",value = "使用中"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })
    public CommonResult<PageResult<RbacPartsVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "man", required = false) String man,
            @RequestParam(value = "sup", required = false) String sup,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacPartsVo> result = rbacPartsService.getIndex(id, name,sup,man, belongto,  pageNum,  pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacPartsDto dto) {
        rbacPartsService.updateParts(dto);
        return CommonResult.success("编辑成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacPartsDto dto) {
        rbacPartsService.createParts(dto);
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacPartsService.deleteParts(id);
        return CommonResult.success("删除成功！");
    }

    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("使用")
    @GetMapping("disposed")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> disposed(@RequestParam(value = "id") Integer id) {
        rbacPartsService.PartsDipose(id);
        return CommonResult.success("成功！");
    }
}

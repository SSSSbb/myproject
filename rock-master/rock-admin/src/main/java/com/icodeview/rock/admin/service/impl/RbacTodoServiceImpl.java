package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacSupDto;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.mapper.RbacTodoMapper;
import com.icodeview.rock.admin.pojo.RbacParts;
import com.icodeview.rock.admin.pojo.RbacSup;
import com.icodeview.rock.admin.pojo.RbacTodo;
import com.icodeview.rock.admin.service.RbacTodoService;
import com.icodeview.rock.admin.vo.RbacSupVo;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class RbacTodoServiceImpl extends ServiceImpl<RbacTodoMapper, RbacTodo> implements RbacTodoService {
    @Override
    public PageResult<RbacTodoVo> getIndex(Integer id, String username, Integer which, Integer belongto, Integer status, String createby, Long pageNum, Long pageSize){
        Page<RbacTodo> todo = new Page<>(pageNum,pageSize);
        Page<RbacTodo> page= lambdaQuery()
                .eq(id != null , RbacTodo::getId, id)
                .eq(which != null , RbacTodo::getWhich, which)
                .eq(belongto != null , RbacTodo::getBelongto, belongto)
                .eq(status != null , RbacTodo::getStatus, status)
                .and(StrUtil.isNotBlank(createby), q -> q.like(RbacTodo::getCreateby, "%" + createby + "%"))
                .and(StrUtil.isNotBlank(username), q -> q.like(RbacTodo::getUsername, "%" + username + "%"))
                .orderByDesc(RbacTodo::getId)
                .page(todo);
        List<RbacTodoVo> record = page.getRecords().stream()
                .map(rbacTodo -> BeanUtil.copyProperties(rbacTodo, RbacTodoVo.class))
                .collect(Collectors.toList());
        System.out.println(record);
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createTodo(RbacTodoDto todoDto) {
        RbacTodo todo = BeanUtil.copyProperties(todoDto, RbacTodo.class);
        todo.setUsername(todoDto.getUsername());
        todo.setWhich(todoDto.getWhich());
        todo.setStatus(todoDto.getStatus());
        todo.setBelongto(todoDto.getBelongto());
        todo.setCreateby(todoDto.getCreateby());
        todo.setCreatedAt(LocalDateTime.now());
        save(todo);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateTodo(RbacTodoDto todoDto) {
        RbacTodo todo = BeanUtil.copyProperties(todoDto, RbacTodo.class);
        todo.setId(todoDto.getId());
        todo.setUsername(todoDto.getUsername());
        todo.setWhich(todoDto.getWhich());
        todo.setStatus(todoDto.getStatus());
        todo.setBelongto(todoDto.getBelongto());
        todo.setCreateby(todoDto.getCreateby());
        todo.setCreatedAt(LocalDateTime.now());
        updateById(todo);

    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteTodo(Integer id) {
        RbacTodo todo = getById(id);
        removeById(todo.getId());
    }

}
